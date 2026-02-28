import { RiskSignal } from './baseSignal';
import { AMLInput } from '../domain/types';
import { RISK_WEIGHTS } from '../../../config/risk.config';
import { REASON_CODES } from '../domain/reasonCodes';

export class ChannelSignal implements RiskSignal {
  name = 'ChannelSignal';

  evaluate(input: AMLInput) {
    const txns = input.transactions ?? [];
    const uniqueChannels = new Set(txns.map(t => t.channel)).size;

    if (uniqueChannels >= 3) {
      return {
        score: RISK_WEIGHTS.multiChannel,
        reasonCode: REASON_CODES.MULTI_CHANNEL_MOVEMENT,
        trace: {
          signal: 'Multi-channel movement',
          weight: RISK_WEIGHTS.multiChannel,
          why: 'Funds moving across channels may indicate layering.'
        }
      };
    }

    return { score: 0 };
  }
}