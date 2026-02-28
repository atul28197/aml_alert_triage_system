export type RiskCategory = 'Low' | 'Medium' | 'High';

export type KYCStatus = 'Completed' | 'Pending' | 'Rejected';

export interface CustomerProfile {
  risk_category: RiskCategory;
  kyc_status: KYCStatus;
  account_age_months: number;
  occupation?: string;
  expected_monthly_volume?: number;
}

export interface Alert {
  alert_type: string;
  triggered_rules: string[];
}

export interface Transaction {
  amount: number;
  type: 'credit' | 'debit';
  channel: string;
  timestamp?: string;
}

export interface AMLInput {
  customer_profile: CustomerProfile;
  alert: Alert;
  transactions: Transaction[];
}

export enum Decision {
  AUTO_CLOSE = 'AUTO_CLOSE',
  ANALYST_REVIEW = 'ANALYST_REVIEW',
  ESCALATE = 'ESCALATE'
}

export interface TriageResult {
  decision: Decision;
  risk_score: number;
  reason_codes: string[];
  llm_disagreement: boolean;
  explanation: string;
  confidence: number;
  trace: any[];
  llm_patterns: string[];
  missing_signals: string[];
}