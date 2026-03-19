import { createAdminClient } from "@/lib/supabase/admin";

const CREDIT_COSTS: Record<string, number> = {
  script_gen: 5,
  creative_gen: 8,
  tts_per_minute: 3,
  render_per_minute: 15,
};

export async function checkAndDeductCredits(
  userId: string,
  action: string,
  projectId?: string,
): Promise<{ success: boolean; balance?: number; error?: string }> {
  const cost = CREDIT_COSTS[action];
  if (!cost) return { success: false, error: `Unknown action: ${action}` };

  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase.rpc("deduct_credits", {
      p_user_id: userId,
      p_amount: cost,
      p_action: action,
      p_project_id: projectId ?? null,
      p_description: `${action} deduction`,
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

export async function getUserCredits(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();
  return data?.credits ?? 0;
}
