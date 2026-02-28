import { AMLInput, TriageResult } from '../aml/domain/types';
import { RiskEngine } from '../aml/domain/riskScore';
import { DecisionEngine } from '../aml/domain/decision';
import { runLLMReasoning } from '../infra/llm.service';

function clamp(score: number) {
  return Math.max(0, Math.min(100, score));
}

export class TriageService {
  private riskEngine = new RiskEngine();
  private decisionEngine = new DecisionEngine();

  async triage(input: AMLInput): Promise<TriageResult> {
    // 1️⃣ Deterministic Risk
    const deterministic = this.riskEngine.compute(input);

    // 2️⃣ LLM Behavioral Validation
    const llm = await runLLMReasoning(input, deterministic);

    // 3️⃣ Combine Risk Score (LLM may adjust)
    const combinedRisk = clamp(
      deterministic.riskScore + Number(llm.llmRiskAdjustment || 0)
    );

    // 4️⃣ Governance Decision
    const decision = this.decisionEngine.decide({
      riskScore: combinedRisk,
      llmDisagreement: Boolean(llm.llmDisagreement)
    });

    // 5️⃣ Final Output (STRICTLY as assignment requires)
    return {
      decision,
      risk_score: combinedRisk,
      reason_codes: deterministic.reasonCodes,
      llm_disagreement: Boolean(llm.llmDisagreement),
      explanation: llm.summary,
      confidence: llm.confidence,
      trace: deterministic.trace,
      llm_patterns: llm.patterns,
      missing_signals: llm.missingSignals
    };
  }
}