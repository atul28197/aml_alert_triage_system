import { AMLInput } from './types';
import { RiskSignal } from '../signals/base.signal';

import { VelocitySignal } from '../signals/velocity.signal';
import { ThresholdAvoidanceSignal } from '../signals/threshold.signal';
import { CustomerRiskSignal } from '../signals/customerRisk.signal';
import { AccountAgeSignal } from '../signals/accountAge.signal';
import { KYCSignal } from '../signals/kyc.signal';
import { ChannelSignal } from '../signals/channel.signal';
import { RuleTriggerSignal } from '../signals/ruleTrigger.signal';

function clamp(score: number) {
  return Math.max(0, Math.min(100, score));
}

export class RiskEngine {
  private signals: RiskSignal[];

  constructor() {
    this.signals = [
      new VelocitySignal(),
      new ThresholdAvoidanceSignal(),
      new CustomerRiskSignal(),
      new KYCSignal(),
      new AccountAgeSignal(),
      new ChannelSignal(),
      new RuleTriggerSignal()
    ];
  }

  compute(input: AMLInput) {
    let totalScore = 0;
    const trace: any[] = [];
    const reasonCodes = new Set<string>();

    for (const signal of this.signals) {
      const result = signal.evaluate(input);

      totalScore += result.score || 0;

      if (result.reasonCode) reasonCodes.add(result.reasonCode);
      if (result.trace) trace.push(result.trace);
    }

    return {
      riskScore: clamp(totalScore),
      reasonCodes: [...reasonCodes],
      trace
    };
  }
}