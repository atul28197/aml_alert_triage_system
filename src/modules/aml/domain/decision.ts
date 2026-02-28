import { Decision } from './types';
import { DECISION_CONFIG } from '../../../config/decision.config';

interface DecisionInput {
  riskScore: number;
  llmDisagreement: boolean;
}

export class DecisionEngine {
  decide(input: DecisionInput): Decision {
    const { riskScore, llmDisagreement } = input;

    if (riskScore >= DECISION_CONFIG.escalateThreshold) {
      return Decision.ESCALATE;
    }

    if (riskScore >= DECISION_CONFIG.reviewThreshold) {
      return Decision.ANALYST_REVIEW;
    }

    // Hard rule from assignment:
    // AUTO_CLOSE only if below threshold AND LLM agrees
    if (riskScore < DECISION_CONFIG.reviewThreshold && !llmDisagreement) {
      return Decision.AUTO_CLOSE;
    }

    return Decision.ANALYST_REVIEW;
  }
}