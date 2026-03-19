export type Plan = "free" | "t1" | "t2";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: Plan;
  credits: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  mode: "template" | "creative" | "quick";
  script_data: any;
  creative_code: string | null;
  status: "draft" | "scripted" | "rendering" | "completed" | "failed";
  created_at: string;
  updated_at: string;
};

export type CreditLog = {
  id: string;
  user_id: string;
  action: string;
  credits: number;
  balance: number;
  project_id: string | null;
  description: string | null;
  created_at: string;
};

export const PLAN_CONFIG = {
  free: { name: "Free", price: 0, monthlyCredits: 30, maxDailyGenerations: 3, resolution: "720p", watermark: true },
  t1: { name: "T1", price: 5, monthlyCredits: 200, maxDailyGenerations: 50, resolution: "1080p", watermark: false },
  t2: { name: "T2", price: 20, monthlyCredits: 1000, maxDailyGenerations: -1, resolution: "1080p", watermark: false },
} as const;

export const CREDIT_COSTS = {
  script_gen: 5,
  creative_gen: 8,
  tts_per_minute: 3,
  render_per_minute: 15,
} as const;
