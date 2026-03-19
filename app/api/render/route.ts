import { renderMediaOnLambda } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import type { SceneData } from "@/src/types";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { scenes } = (await request.json()) as { scenes: SceneData[] };

    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        { error: "At least one scene is required" },
        { status: 400 },
      );
    }

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: "us-east-1",
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      serveUrl: process.env.REMOTION_SERVE_URL!,
      composition: "SceneVideo",
      inputProps: { scenes },
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      privacy: "public",
    });

    return NextResponse.json({ renderId, bucketName });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Render failed" },
      { status: 500 },
    );
  }
}
