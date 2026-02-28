import { AMLInput } from '../aml/domain/types';

interface DeterministicResult {
  riskScore: number;
  trace: any[];
  reasonCodes: string[];
}

interface LLMResponse {
  summary: string;
  patterns: string[];
  missingSignals: string[];
  llmRiskAdjustment: number;
  llmDisagreement: boolean;
  confidence: number;
}

/**
 * Heuristic reasoning fallback (offline-friendly)
 * Must reason over BEHAVIOR — not summarize.
 */
function heuristicReasoning(
  input: AMLInput,
  deterministic: DeterministicResult
): LLMResponse {
  const patterns: string[] = [];
  const missingSignals: string[] = [];

  const txns = input.transactions ?? [];

  const nearThresholdCount = txns.filter(
    (t) => t.amount >= 90000 && t.amount < 100000
  ).length;

  if (nearThresholdCount >= 2) {
    patterns.push('Possible structuring / threshold avoidance');
  }

  if (txns.length >= 3) {
    patterns.push('High velocity transaction pattern');
  }

  const uniqueChannels = new Set(txns.map((t) => t.channel)).size;
  if (uniqueChannels >= 3) {
    patterns.push('Layering via multi-channel movement');
  }

  if (!input.customer_profile?.expected_monthly_volume) {
    missingSignals.push('Missing expected monthly volume baseline');
  }

  if (!input.transactions?.every((t) => t.timestamp)) {
    missingSignals.push('Missing full timestamp data');
  }

  const llmRiskAdjustment = patterns.length >= 2 ? 5 : 0;

  const llmDisagreement =
    deterministic.riskScore < 45 && patterns.length >= 2;

  return {
    summary: llmDisagreement
      ? 'Behavioral analysis suggests deterministic risk may be underestimated.'
      : 'Behavioral patterns broadly align with deterministic assessment.',
    patterns,
    missingSignals,
    llmRiskAdjustment,
    llmDisagreement,
    confidence: missingSignals.length >= 2 ? 0.65 : 0.82
  };
}

/**
 * OpenAI reasoning (optional — only if API key present)
 */
async function openAIReasoning(
  input: AMLInput,
  deterministic: DeterministicResult
): Promise<LLMResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return heuristicReasoning(input, deterministic);
  }

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are an AML reviewer. Validate deterministic risk score. Return JSON only.'
            },
            {
              role: 'user',
              content: JSON.stringify({ input, deterministic })
            }
          ],
          temperature: 0.2
        })
      }
    );

    if (!response.ok) {
      return heuristicReasoning(input, deterministic);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return heuristicReasoning(input, deterministic);
    }

    return JSON.parse(content);
  } catch {
    return heuristicReasoning(input, deterministic);
  }
}

export async function runLLMReasoning(
  input: AMLInput,
  deterministic: DeterministicResult
): Promise<LLMResponse> {
  return openAIReasoning(input, deterministic);
}