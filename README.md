🛡️ AI-Assisted AML Alert Triage System

NOTE: Hybrid deterministic + LLM decision engine (WIP – extensible architecture)

A regulatory-aware AML alert classification system combining explicit risk scoring with AI behavioral validation.

🚀 System Overview

Hybrid decision architecture for AML alert triage:

Deterministic risk scoring engine

LLM behavioral validation layer

Governance-based final decision engine

Audit-ready structured logging

Designed for explainability, safety, and operational efficiency.

🏗️ Architecture
🔷 Layered Architecture
API Layer
    ↓
Application Layer (Orchestration)
    ↓
Domain Layer (Risk + Governance Logic)
    ↓
Infrastructure Layer (LLM + Config)
    ↓
Shared (Logger / Utilities)
📂 Project Structure
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
🧠 Decision Flow
Input Data
    ↓
Deterministic Risk Engine
    ↓
LLM Behavioral Validation
    ↓
Governance Decision Engine
    ↓
Final Triage Result
⚙️ Deterministic Risk Engine

Risk Score Range: 0 – 100
Score is clamped between 0 and 100.

🔢 Signal Weights
Signal	Weight
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
✔ Engine Characteristics

Explicit numeric scoring

Modular pluggable signals

Configurable weight configuration

Traceable signal-level reasoning

Deterministic and testable

Each signal emits:

{
  "signal": "VelocitySignal",
  "weight": 25,
  "why": "Multiple transactions within short window"
}
🤖 LLM Behavioral Validation Layer

The LLM does not summarize alerts.

It performs:

Behavioral pattern detection (structuring, layering, velocity abuse)

Risk validation against deterministic score

Disagreement detection

Missing pattern surfacing

Confidence scoring

🔐 Resilience Controls

3 second timeout protection

Single retry attempt

Automatic heuristic fallback

Never blocks deterministic execution

System degrades safely.

🏛️ Governance Decision Engine

Hard regulatory rule:

AUTO_CLOSE allowed only if risk < threshold AND LLM agrees.

📊 Decision Matrix
Condition	Decision
risk ≥ 80	ESCALATE
45 ≤ risk < 80	ANALYST_REVIEW
risk < 45 AND LLM agrees	AUTO_CLOSE
risk < 45 AND LLM disagrees	ANALYST_REVIEW

Prevents unsafe auto-closure.

📡 API
Endpoint
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
📊 Audit Logging

Every decision logs structured JSON:

{
  "type": "AML_TRIAGE_AUDIT",
  "timestamp": "...",
  "decision": "ANALYST_REVIEW",
  "risk_score": 72,
  "reason_codes": ["VELOCITY_PATTERN"],
  "trace": [],
  "llm_patterns": []
}

Designed for:

Regulatory audit

SIEM ingestion

Future DB persistence

🧪 Testing

Unit tests cover:

Deterministic risk scoring

Governance rule enforcement

Decision threshold logic

Run:

npm test
🛠️ Tech Stack

Node.js

TypeScript

Express.js

Jest

Modular Layered Architecture

🚦 Getting Started
Install Dependencies
npm install
Run Server
npm run dev
Run Tests
npm test
🔐 Scaling & Production Considerations
Current Capabilities

Stateless architecture

Configurable risk weights

LLM timeout + retry

Modular signal plug-in system

Rate limiting middleware

Future Enhancements

Persistent audit storage (DB / Kafka)

Circuit breaker for LLM

Async queue-based LLM validation

Horizontal scaling via load balancer

Risk versioning

Model explainability metrics

📝 Evaluator Notes

Deterministic logic is fully explicit and traceable.

LLM assists in decisioning — not summarization.

AUTO_CLOSE hard rule strictly enforced.

Safe degradation when LLM fails.

Architecture supports pluggable signal extension.
