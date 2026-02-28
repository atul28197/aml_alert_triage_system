import { RiskSignal } from './base.signal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';

export class ThresholdAvoidanceSignal implements RiskSignal {
  name = 'ThresholdAvoidanceSignal';

  evaluate(input: AMLInput) {
    const txns = input.transactions ?? [];

    const nearThresholdCount = txns.filter((t) => {
      const amount = Number(t.amount) || 0;
      return amount >= 90000 && amount < 100000;
    }).length;

    if (nearThresholdCount >= 2) {
      return {
        score: RISK_WEIGHTS.thresholdAvoidance,
        reasonCode: REASON_CODES.THRESHOLD_AVOIDANCE,
        trace: {
          signal: 'Repeated amounts near reporting threshold',
          weight: RISK_WEIGHTS.thresholdAvoidance,
          why: 'Could indicate structuring behavior to avoid reporting limits.'
        }
      };
    }

    return { score: 0 };
  }
}