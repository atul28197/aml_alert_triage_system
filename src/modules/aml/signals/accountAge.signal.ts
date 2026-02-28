import { RiskSignal } from './baseSignal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';
export class AccountAgeSignal implements RiskSignal {
  name = 'AccountAgeSignal';

  evaluate(input: AMLInput) {
    const age = Number(input.customer_profile?.account_age_months) || 0;

    if (age > 12) {
      return {
        score: RISK_WEIGHTS.stableAccount,
        reasonCode: REASON_CODES.STABLE_ACCOUNT,
        trace: {
          signal: 'Account older than 12 months',
          weight: RISK_WEIGHTS.stableAccount,
          why: 'Long-standing accounts often have stable transaction patterns.'
        }
      };
    }

    if (age > 0 && age <= 3) {
      return {
        score: RISK_WEIGHTS.newAccount,
        reasonCode: REASON_CODES.NEW_ACCOUNT,
        trace: {
          signal: 'New account (<=3 months)',
          weight: RISK_WEIGHTS.newAccount,
          why: 'New accounts are less behaviorally understood.'
        }
      };
    }

    return { score: 0 };
  }
}