import { getRenderProgress } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get("renderId");
    const bucketName = searchParams.get("bucketName");

    if (!renderId || !bucketName) {
      return NextResponse.json(
        { error: "renderId and bucketName are required" },
        { status: 400 },
      );
    }

    const progress = await getRenderProgress({
      renderId,
      bucketName,
      region: "us-east-1",
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
    });

    return NextResponse.json({
      progress: progress.overallProgress,
      done: progress.done,
      outputUrl: progress.outputFile,
      fatalErrorEncountered: progress.fatalErrorEncountered,
    });
  } catch (error) {
    console.error("Progress check error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to check progress",
      },
      { status: 500 },
    );
  }
}
