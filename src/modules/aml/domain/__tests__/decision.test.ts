import { DecisionEngine } from "../decision";
import { Decision } from "../types";

describe("DecisionEngine", () => {
  it("should NOT auto close if LLM disagrees", () => {
    const engine = new DecisionEngine();

    const decision = engine.decide({
      riskScore: 30,
      llmDisagreement: true
    });

    expect(decision).toBe(Decision.ANALYST_REVIEW);
  });
});