export interface AuditLogEntry {
  timestamp: string;
  decision: string;
  risk_score: number;
  reason_codes: string[];
  llm_disagreement: boolean;
  trace: any[];
  llm_patterns: string[];
}

export function logAudit(entry: AuditLogEntry) {
  console.log(
    JSON.stringify({
      type: "AML_TRIAGE_AUDIT",
      ...entry
    })
  );
}