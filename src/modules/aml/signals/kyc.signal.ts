import { RiskSignal } from './baseSignal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';

export class KYCSignal implements RiskSignal {
  name = 'KYCSignal';

  evaluate(input: AMLInput) {
    const kycStatus = input.customer_profile?.kyc_status;

    if (kycStatus && kycStatus !== 'Completed') {
      return {
        score: RISK_WEIGHTS.kycIncomplete,
        reasonCode: REASON_CODES.KYC_INCOMPLETE,
        trace: {
          signal: 'KYC incomplete',
          weight: RISK_WEIGHTS.kycIncomplete,
          why: 'Incomplete due diligence increases unknown risk.'
        }
      };
    }

    return { score: 0 };
  }
}