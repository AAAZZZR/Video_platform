import { renderMediaOnLambda } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import type { SceneData } from "@/src/types";
import { getUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();

    let composition: string;
    let inputProps: Record<string, unknown>;

    if (body.creative) {
      // Creative mode - render dynamic code
      if (!body.code) {
        return NextResponse.json({ error: "Code is required for creative render" }, { status: 400 });
      }
      composition = "DynamicVideo";
      inputProps = {
        code: body.code,
        audioUrl: body.audioUrl || undefined,
      };
    } else {
      // Template mode - render scenes
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

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: "us-east-1",
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      serveUrl: process.env.REMOTION_SERVE_URL!,
      composition,
      inputProps,
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      privacy: "public",
    });

    // Save render to database
    try {
      const supabase = createAdminClient();
      await supabase.from("renders").insert({
        user_id: user.id,
        project_id: null, // Could link to project in future
        status: "rendering",
        lambda_id: renderId,
        started_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error("Failed to save render:", dbErr);
    }

    return NextResponse.json({ renderId, bucketName });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Render failed" },
      { status: 500 },
    );
  }
}
