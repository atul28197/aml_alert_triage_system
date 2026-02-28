import { RiskSignal } from './baseSignal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';
export class RuleTriggerSignal implements RiskSignal {
  name = 'RuleTriggerSignal';

  evaluate(input: AMLInput) {
    const triggeredRules = input.alert?.triggered_rules ?? [];

    if (triggeredRules.length >= 2) {
      return {
        score: RISK_WEIGHTS.multiRule,
        reasonCode: REASON_CODES.MULTI_RULE_TRIGGER,
        trace: {
          signal: 'Multiple rule triggers',
          weight: RISK_WEIGHTS.multiRule,
          why: 'Multiple independent alerts increase confidence of risk.'
        }
      };
    }

    return { score: 0 };
  }
}