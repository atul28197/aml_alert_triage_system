import { RiskSignal } from './base.signal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';

export class CustomerRiskSignal implements RiskSignal {
  name = 'CustomerRiskSignal';

  evaluate(input: AMLInput) {
    const riskCategory = input.customer_profile?.risk_category;

    if (riskCategory === 'High') {
      return {
        score: RISK_WEIGHTS.highRiskCustomer,
        reasonCode: REASON_CODES.HIGH_RISK_CUSTOMER,
        trace: {
          signal: 'High-risk customer category',
          weight: RISK_WEIGHTS.highRiskCustomer,
          why: 'Customer baseline risk profile is elevated.'
        }
      };
    }

    if (riskCategory === 'Medium') {
      return {
        score: RISK_WEIGHTS.mediumRiskCustomer,
        reasonCode: REASON_CODES.MEDIUM_RISK_CUSTOMER,
        trace: {
          signal: 'Medium-risk customer category',
          weight: RISK_WEIGHTS.mediumRiskCustomer,
          why: 'Customer baseline risk profile moderately elevated.'
        }
      };
    }

    return { score: 0 };
  }
}