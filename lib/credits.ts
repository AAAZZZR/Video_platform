import { createAdminClient } from "@/lib/supabase/admin";

// ─── Token-to-credit conversion ───
// Rate: credits per 1K tokens (output costs more because it's more expensive)
const CREDITS_PER_1K_INPUT = 0.5;
const CREDITS_PER_1K_OUTPUT = 2.0;
// Minimum charge per API call
const MIN_CREDITS = 1;

// Fixed costs for non-token-based actions
const FIXED_COSTS: Record<string, number> = {
  render: 10,
  tts: 5,
};

/**
 * Estimate tokens from text.
 * English ~4 chars/token, CJK ~1.5 chars/token.
 * We use ~2.5 as a conservative average for mixed content.
 */
export function estimateInputTokens(text: string): number {
  return Math.ceil(text.length / 2.5);
}

/**
 * Calculate credits from actual token usage.
 */
export function tokensToCredits(inputTokens: number, outputTokens: number): number {
  const cost =
    (inputTokens / 1000) * CREDITS_PER_1K_INPUT +
    (outputTokens / 1000) * CREDITS_PER_1K_OUTPUT;
  return Math.max(MIN_CREDITS, Math.ceil(cost));
}

/**
 * Estimate max credits for a generation call (for pre-check).
 * Uses estimated input tokens + max_tokens as worst-case output.
 */
export function estimateMaxCredits(promptText: string, maxOutputTokens: number): number {
  const inputTokens = estimateInputTokens(promptText);
  return tokensToCredits(inputTokens, maxOutputTokens);
}

/**
 * Pre-check: does the user have enough credits for the estimated cost?
 * Does NOT deduct — just checks.
 */
export async function checkCredits(
  userId: string,
  estimatedCost: number,
): Promise<{ ok: boolean; balance: number }> {
  const balance = await getUserCredits(userId);
  return { ok: balance >= estimatedCost, balance };
}

/**
 * Deduct credits (actual amount after API call).
 */
export async function deductCredits(
  userId: string,
  amount: number,
  action: string,
  description: string,
  projectId?: string,
): Promise<{ success: boolean; balance?: number; error?: string }> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase.rpc("deduct_credits", {
      p_user_id: userId,
      p_amount: amount,
      p_action: action,
      p_project_id: projectId ?? null,
      p_description: description,
    });

    if (error) {
      if (error.message.includes("Insufficient credits")) {
        return { success: false, error: "Insufficient credits" };
      }
      return { success: false, error: error.message };
    }

    return { success: true, balance: data as number };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Credit deduction failed" };
  }
}

/**
 * Deduct a fixed cost (for render, tts, etc.)
 */
export async function deductFixedCredits(
  userId: string,
  action: string,
  projectId?: string,
): Promise<{ success: boolean; balance?: number; error?: string }> {
  const cost = FIXED_COSTS[action];
  if (!cost) return { success: false, error: `Unknown action: ${action}` };
  return deductCredits(userId, cost, action, `${action} deduction`, projectId);
}

export async function getUserCredits(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();
  return data?.credits ?? 0;
}
