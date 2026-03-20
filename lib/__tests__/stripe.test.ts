import { describe, it, expect, vi } from "vitest";

// Must set env BEFORE module evaluation
vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");
vi.stubEnv("STRIPE_T1_PRICE_ID", "price_t1_test");
vi.stubEnv("STRIPE_T2_PRICE_ID", "price_t2_test");

vi.mock("stripe", () => ({
  default: class FakeStripe { constructor() {} },
}));

describe("stripe config", async () => {
  // Dynamic import AFTER env is stubbed
  const { PLANS, getPlanByPriceId } = await import("../stripe");

  describe("PLANS config", () => {
    it("t1 has 200 credits", () => {
      expect(PLANS.t1.credits).toBe(200);
    });

    it("t2 has 1000 credits", () => {
      expect(PLANS.t2.credits).toBe(1000);
    });

    it("uses env vars for priceId", () => {
      expect(PLANS.t1.priceId).toBe("price_t1_test");
      expect(PLANS.t2.priceId).toBe("price_t2_test");
    });
  });

  describe("getPlanByPriceId", () => {
    it("returns t1 for T1 price ID", () => {
      expect(getPlanByPriceId("price_t1_test")).toBe("t1");
    });

    it("returns t2 for T2 price ID", () => {
      expect(getPlanByPriceId("price_t2_test")).toBe("t2");
    });

    it("returns null for unknown price ID", () => {
      expect(getPlanByPriceId("price_unknown")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(getPlanByPriceId("")).toBeNull();
    });
  });
});
