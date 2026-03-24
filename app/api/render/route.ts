import { renderMediaOnLambda } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import type { SceneData } from "@/src/types";
import { getUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkCredits, deductFixedCredits } from "@/lib/credits";

// Track active renders to prevent burst
const activeRenders = new Map<string, number>();
const MAX_CONCURRENT_PER_USER = 2;
const MAX_CONCURRENT_GLOBAL = 4;
let globalActiveRenders = 0;

// Retry helper for Lambda rate limits
async function renderWithRetry(
  params: Parameters<typeof renderMediaOnLambda>[0],
  maxAttempts = 3,
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await renderMediaOnLambda(params);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit =
        msg.includes("Rate Exceeded") ||
        msg.includes("Concurrency limit") ||
        msg.includes("TooManyRequestsException");
      if (!isRateLimit || attempt === maxAttempts) throw err;
      // Exponential backoff: 3s, 6s
      await new Promise((r) => setTimeout(r, attempt * 3000));
    }
  }
  throw new Error("Render failed after retries");
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Check concurrent render limits
  const userRenders = activeRenders.get(user.id) ?? 0;
  if (userRenders >= MAX_CONCURRENT_PER_USER) {
    return NextResponse.json(
      { error: "Too many active renders. Please wait for current renders to finish." },
      { status: 429 },
    );
  }
  if (globalActiveRenders >= MAX_CONCURRENT_GLOBAL) {
    return NextResponse.json(
      { error: "Server is busy rendering. Please try again in a moment." },
      { status: 429 },
    );
  }

  // Credit check
  const { ok, balance } = await checkCredits(user.id, 10);
  if (!ok) {
    return NextResponse.json(
      { error: `Insufficient credits. Need 10, have ${balance}.` },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    let composition: string;
    let inputProps: Record<string, unknown>;

    if (body.creative) {
      if (!body.code) {
        return NextResponse.json({ error: "Code is required for creative render" }, { status: 400 });
      }
      composition = "DynamicVideo";
      inputProps = {
        code: body.code,
        audioUrl: body.audioUrl || undefined,
        durationInFrames: body.durationInFrames || 300,
      };
    } else {
      const scenes = body.scenes;
      if (!scenes || scenes.length === 0) {
        return NextResponse.json(
          { error: "At least one scene is required" },
          { status: 400 },
        );
      }
      composition = "SceneVideo";
      inputProps = { scenes };
    }

    // Track active render
    activeRenders.set(user.id, userRenders + 1);
    globalActiveRenders++;

    const { renderId, bucketName } = await renderWithRetry({
      region: "us-east-1",
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      serveUrl: process.env.REMOTION_SERVE_URL!,
      composition,
      inputProps,
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 2,
      privacy: "public",
      framesPerLambda: 320,
    });

    // Deduct credits after Lambda accepted the render
    await deductFixedCredits(user.id, "render");

    // Save render to database
    try {
      const supabase = createAdminClient();
      await supabase.from("renders").insert({
        user_id: user.id,
        project_id: null,
        status: "rendering",
        lambda_id: renderId,
        credits_used: 10,
        started_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error("Failed to save render:", dbErr);
    }

    // Release after timeout (renders typically finish in <60s)
    setTimeout(() => {
      const current = activeRenders.get(user.id) ?? 1;
      if (current <= 1) activeRenders.delete(user.id);
      else activeRenders.set(user.id, current - 1);
      globalActiveRenders = Math.max(0, globalActiveRenders - 1);
    }, 120_000);

    return NextResponse.json({ renderId, bucketName });
  } catch (error) {
    // Release on error
    const current = activeRenders.get(user.id) ?? 1;
    if (current <= 1) activeRenders.delete(user.id);
    else activeRenders.set(user.id, current - 1);
    globalActiveRenders = Math.max(0, globalActiveRenders - 1);

    console.error("Render error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Render failed" },
      { status: 500 },
    );
  }
}
