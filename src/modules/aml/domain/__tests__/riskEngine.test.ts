import { RiskEngine } from "../riskScore";

describe("RiskEngine", () => {
  it("should detect velocity pattern", () => {
    const engine = new RiskEngine();

    const result = engine.compute({
      customer_profile: {
        risk_category: "Low",
        kyc_status: "Completed",
        account_age_months: 12
      },
      alert: {
        alert_type: "Velocity",
        triggered_rules: []
      },
      transactions: [
        { amount: 1000, type: "credit", channel: "UPI" },
        { amount: 2000, type: "credit", channel: "UPI" },
        { amount: 3000, type: "credit", channel: "UPI" }
      ]
    });

    expect(result.riskScore).toBeGreaterThan(0);
  });
});