# AI-Assisted AML Alert Triage System

Deterministic + LLM-assisted decision engine for AML alert classification
Built with Node.js, TypeScript, Express, and a modular layered architecture.

## 1. Problem Context

Financial institutions receive a high volume of AML (Anti-Money Laundering) alerts triggered by rule engines detecting:

Velocity anomalies

Threshold breaches

Unusual transaction behavior

The real operational challenge is not summarization — it is decision-making:

Which alerts can be safely AUTO_CLOSE?

Which require ANALYST_REVIEW?

Which must be ESCALATE?

Manual triage introduces:

Bottlenecks

Inconsistency

Regulatory risk

### Solution Approach

This system introduces a hybrid decision model:

Deterministic risk scoring

LLM-based behavioral validation

Governance-based final decision logic

The goal: faster, consistent, explainable triage decisions.

## 🏗️ 2. Architecture Overview

### Logical Component Diagram

+------------------+
|   Client / API   |
+------------------+
          |
          v
+------------------+
|  Triage Service  |
+------------------+
          |
          v
+-----------------------+
| Deterministic Engine  |
| (Risk Signals)        |
+-----------------------+
          |
          v
+-----------------------+
| LLM Validator         |
| (Timeout + Retry)     |
+-----------------------+
          |
          v
+-----------------------+
| Governance Engine     |
+-----------------------+
          |
          v
+-----------------------+
| Audit Logger          |
+-----------------------+

### Layered Architecture Diagram

+------------------------+
|       API Layer        |
| (Controller, Routes)   |
+------------------------+
            |
            v
+------------------------+
|   Application Layer    |
| (Triage Orchestration) |
+------------------------+
            |
            v
+------------------------+
|      Domain Layer      |
| Risk + Decision Logic  |
+------------------------+
            |
            v
+------------------------+
| Infrastructure Layer   |
| LLM, Config, Logging   |
+------------------------+

### Sequence Flow Diagram

Client
  |
  | POST /triage
  v
Controller
  |
  v
Triage Service
  |
  |---> Risk Engine
  |         |
  |         v
  |     Risk Score
  |
  |---> LLM Service
  |         |
  |         v
  |     Validation / Adjustment
  |
  |---> Governance Engine
  |         |
  |         v
  |     Final Decision
  |
  |---> Audit Log
  |
  v
Response


### 📂 Project Structure
src/
 ├── modules/
 │   ├── aml/
 │   │   ├── domain/
 │   │   │   ├── signals/
 │   │   │   ├── riskScore.ts
 │   │   │   ├── decision.ts
 │   │   │   └── types.ts
 │   │   ├── infra/
 │   │   │   └── llm.service.ts
 │   │   └── application/
 │   │       └── triage.service.ts
 │   ├── api/
 │   │   ├── triage.controller.ts
 │   │   └── triage.routes.ts
 ├── shared/
 │   └── logger.ts
 ├── swagger/
 │   └── swagger.yaml
 ├── app.ts
 └── server.ts



 
## 🧠 3. Decision Flow
Input Data
    ↓
Deterministic Risk Engine
    ↓
LLM Behavioral Validation
    ↓
Governance Decision Engine
    ↓
Final Triage Result
## ⚙️ 4. Deterministic Risk Logic

Risk Score Range: 0 – 100

Each signal contributes explicit weighted score.

#### Signal	Weight
Velocity Pattern	+25
Threshold Avoidance	+20
High Risk Customer	+20
Medium Risk Customer	+10
KYC Incomplete	+15
New Account	+10
Stable Account	-15
Large Cash Activity	+10
Multi-Channel Movement	+8
Multiple Rule Trigger	+10
✔ Key Characteristics

Explicit numeric scoring

Modular pluggable signals

Configurable weights

Traceable reasoning

Score clamped between 0–100

Each signal logs structured trace:

{
  "signal": "Velocity Pattern",
  "weight": 25,
  "why": "Multiple transactions in short window"
}
🤖 5. LLM Reasoning Layer

The LLM is used for behavioral reasoning, NOT summarization.

It performs:

Pattern detection (structuring, velocity abuse, layering)

Risk validation or challenge

Missing signal identification

Disagreement detection

Confidence scoring

### 🔐 Resilience Features

3-second timeout

Single retry attempt

Automatic fallback to heuristic reasoning

Deterministic flow never blocked

## 🏛️ 6. Governance Decision Logic
### 🚨 Hard Rule (Regulatory Requirement)

AUTO_CLOSE is allowed only if:

Risk score is below threshold

LLM agrees with the assessment

### 📊 Decision Matrix
Condition	Decision
risk ≥ 80	ESCALATE
45 ≤ risk < 80	ANALYST_REVIEW
risk < 45 AND LLM agrees	AUTO_CLOSE
risk < 45 AND LLM disagrees	ANALYST_REVIEW

This ensures no alert is auto-closed when behavioral risk is detected.

## 📡 7. API
POST /api/triage
Example Request
{
  "customer_profile": {
    "risk_category": "Medium",
    "kyc_status": "Completed",
    "account_age_months": 14
  },
  "alert": {
    "alert_type": "High Velocity Transactions",
    "triggered_rules": ["R-102", "R-311"]
  },
  "transactions": [
    { "amount": 98000, "type": "credit", "channel": "UPI" },
    { "amount": 97000, "type": "credit", "channel": "UPI" },
    { "amount": 99000, "type": "credit", "channel": "UPI" }
  ]
}
Example Response
{
  "decision": "ANALYST_REVIEW",
  "risk_score": 72,
  "reason_codes": ["VELOCITY_PATTERN", "THRESHOLD_AVOIDANCE"],
  "llm_disagreement": false,
  "explanation": "Behavioral patterns align with deterministic risk.",
  "confidence": 0.82
}
## 📊 8. Audit Logging

Every triage decision logs structured JSON:

{
  "type": "AML_TRIAGE_AUDIT",
  "timestamp": "...",
  "decision": "ANALYST_REVIEW",
  "risk_score": 72,
  "reason_codes": [],
  "trace": [],
  "llm_patterns": []
}

Designed for:

Regulatory audit

SIEM ingestion

Future persistence to database

## 🧪 9. Testing

Unit tests cover:

Deterministic risk scoring

Hard governance rule enforcement

Run:

npm test
## 🚀 10. Getting Started
Install Dependencies
npm install
Run Development Server
npm run dev

## 🔐 11. Scaling & Production Considerations
### Current Capabilities

Stateless architecture

Configurable risk weights

Timeout + retry for LLM

Rate limiting middleware

Modular signal extensibility

### Future Enhancements

Persistent audit storage (DB / Kafka)

Circuit breaker for LLM

Horizontal scaling

Async queue-based LLM validation

Risk model versioning

Observability metrics

## 📝 12. Notes for Evaluator

Deterministic logic is explicit and auditable

LLM participates in behavioral validation (not summarization)

AUTO_CLOSE hard rule is strictly enforced

System degrades safely when LLM fails

Architecture supports extensibility and scalability

Governance logic is isolated and unit tested

## 📦 13. Tech Stack

Node.js

TypeScript

Express

Jest

Swagger (OpenAPI 3.0)

## 🏁 Conclusion

This solution demonstrates a hybrid AML triage system where:

Deterministic rules ensure regulatory clarity

LLM enhances behavioral intelligence

Governance safeguards enforce compliance

Designed to reduce AML triage bottlenecks while maintaining explainability and auditability.
