import { AMLInput } from '../domain/types';
import { ReasonCode } from '../domain/reasonCodes';

export interface RiskSignalResult {
  score: number;
  reasonCode?: ReasonCode;
  trace?: {
    signal: string;
    weight: number;
    why: string;
  };
}

export interface RiskSignal {
  name: string;
  evaluate(input: AMLInput): RiskSignalResult;
}