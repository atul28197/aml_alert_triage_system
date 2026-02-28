import { RiskSignal } from './base.signal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';

export class VelocitySignal implements RiskSignal {
  name = 'VelocitySignal';

  evaluate(input: AMLInput) {
    const txCount = input.transactions?.length ?? 0;

    if (txCount >= 3) {
      return {
        score: RISK_WEIGHTS.velocity,
        reasonCode: REASON_CODES.VELOCITY_PATTERN,
        trace: {
          signal: 'Multiple transactions in short window',
          weight: RISK_WEIGHTS.velocity,
          why: 'Higher chance of velocity-based laundering behavior.'
        }
      };
    }

    return { score: 0 };
  }
}