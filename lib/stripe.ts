import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  t1: {
    priceId: process.env.STRIPE_T1_PRICE_ID!,
    credits: 200,
    name: "T1",
  },
  t2: {
    priceId: process.env.STRIPE_T2_PRICE_ID!,
    credits: 1000,
    name: "T2",
  },
} as const;

/** Map Stripe Price ID → plan key */
export function getPlanByPriceId(priceId: string): "t1" | "t2" | null {
  if (priceId === PLANS.t1.priceId) return "t1";
  if (priceId === PLANS.t2.priceId) return "t2";
  return null;
}
