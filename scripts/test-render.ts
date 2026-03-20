/**
 * End-to-end Lambda render test.
 * Tests both Template mode (SceneVideo) and Creative mode (DynamicVideo).
 *
 * Usage: npx tsx scripts/test-render.ts [template|creative|both]
 */

import { renderMediaOnLambda, getRenderProgress } from "@remotion/lambda/client";
import dotenv from "dotenv";

dotenv.config();

const REGION = "us-east-1";
const FUNCTION_NAME = process.env.REMOTION_LAMBDA_FUNCTION_NAME!;
const SERVE_URL = process.env.REMOTION_SERVE_URL!;

// ── Template mode test: exercises all 9 scene types ──
const TEMPLATE_SCENES = [
  {
    type: "title",
    title: "Render Test",
    subtitle: "Testing all scene types",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    durationInFrames: 30, // 1 second each to keep it short
  },
  {
    type: "text",
    title: "Text Scene",
    body: "This is a text body test.",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    durationInFrames: 30,
  },
  {
    type: "bullets",
    title: "Bullets Scene",
    items: ["Item one", "Item two", "Item three"],
    background: "linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)",
    durationInFrames: 30,
  },
  {
    type: "table",
    title: "Table Scene",
    headers: ["Name", "Value"],
    rows: [["Alpha", "100"], ["Beta", "200"]],
    background: "linear-gradient(135deg, #0a192f 0%, #112240 100%)",
    durationInFrames: 30,
  },
  {
    type: "chart-bar",
    title: "Chart Scene",
    items: [{ label: "A", value: 80 }, { label: "B", value: 50 }],
    background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
    durationInFrames: 30,
  },
  {
    type: "stats",
    title: "Stats Scene",
    items: [{ value: "99%", label: "Uptime" }, { value: "42ms", label: "Latency" }],
    background: "linear-gradient(135deg, #0f0c29 0%, #24243e 100%)",
    durationInFrames: 30,
  },
  {
    type: "comparison",
    title: "Comparison Scene",
    leftTitle: "Before",
    rightTitle: "After",
    leftItems: ["Slow", "Manual"],
    rightItems: ["Fast", "Automated"],
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    durationInFrames: 30,
  },
  {
    type: "quote",
    title: "",
    quote: "Testing is doubting.",
    author: "Test Bot",
    background: "linear-gradient(135deg, #0a192f 0%, #1d3557 100%)",
    durationInFrames: 30,
  },
  {
    type: "code",
    title: "Code Scene",
    code: 'console.log("Hello from Lambda!");',
    language: "javascript",
    background: "linear-gradient(135deg, #2d1b69 0%, #0a192f 100%)",
    durationInFrames: 30,
  },
];

// ── Creative mode test: uses all sandbox modules ──
const CREATIVE_CODE = `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { Audio } from '@remotion/media';
import { whoosh } from '@remotion/sfx'; // whoosh is a string URL, not a function
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { evolvePath, getLength } from '@remotion/paths';

// DURATION: 90

export default function TestComp() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps, config: { damping: 200 } });

  const path = "M 0 0 L 100 100";
  const len = getLength(path);
  const evolved = evolvePath(frame / 90, path);
  const sfxUrl = whoosh; // it's already a URL string

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
      <Sequence from={0} durationInFrames={45}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{
            fontSize: 64,
            color: 'white',
            opacity,
            transform: \`scale(\${scale})\`,
            fontFamily: 'sans-serif',
          }}>
            Lambda Test
          </h1>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={45} durationInFrames={45}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <svg width="200" height="200" viewBox="0 0 100 100">
            <path d={evolved} stroke="cyan" strokeWidth="3" fill="none" />
          </svg>
          <p style={{ color: '#888', fontSize: 18, fontFamily: 'monospace' }}>
            Path length: {len} | Frame: {frame}
          </p>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
`;

// ── Helpers ──

async function renderAndPoll(
  label: string,
  composition: string,
  inputProps: Record<string, unknown>,
): Promise<{ success: boolean; url?: string; error?: string }> {
  console.log(`\n[${ label }] Starting Lambda render...`);
  console.log(`  Composition: ${composition}`);
  console.log(`  Function: ${FUNCTION_NAME}`);

  const startTime = Date.now();

  try {
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: REGION,
      functionName: FUNCTION_NAME,
      serveUrl: SERVE_URL,
      composition,
      inputProps,
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      privacy: "public",
      framesPerLambda: 200, // Reduce parallel Lambda invocations
    });

    console.log(`  Render started: ${renderId}`);
    console.log(`  Bucket: ${bucketName}`);

    // Poll progress
    let done = false;
    let lastProgress = 0;

    while (!done) {
      await new Promise((r) => setTimeout(r, 2000));

      const progress = await getRenderProgress({
        renderId,
        bucketName,
        region: REGION,
        functionName: FUNCTION_NAME,
      });

      const pct = Math.round((progress.overallProgress ?? 0) * 100);
      if (pct !== lastProgress) {
        console.log(`  Progress: ${pct}%`);
        lastProgress = pct;
      }

      if (progress.fatalErrorEncountered) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const errMsg = progress.errors?.[0]?.message || "Unknown Lambda error";
        console.error(`  FATAL ERROR after ${elapsed}s: ${errMsg}`);
        return { success: false, error: errMsg };
      }

      if (progress.done) {
        done = true;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`  Done in ${elapsed}s`);
        console.log(`  Output: ${progress.outputFile}`);
        return { success: true, url: progress.outputFile ?? undefined };
      }
    }

    return { success: false, error: "Loop exited unexpectedly" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ERROR: ${msg}`);
    return { success: false, error: msg };
  }
}

// ── Main ──

async function main() {
  const mode = process.argv[2] || "both";

  console.log("=== VidCraft Lambda Render Test ===");
  console.log(`  Region: ${REGION}`);
  console.log(`  Function: ${FUNCTION_NAME}`);
  console.log(`  Serve URL: ${SERVE_URL}`);
  console.log(`  Mode: ${mode}`);

  const results: { label: string; success: boolean; url?: string; error?: string }[] = [];

  if (mode === "template" || mode === "both") {
    const r = await renderAndPoll("TEMPLATE", "SceneVideo", { scenes: TEMPLATE_SCENES });
    results.push({ label: "Template (9 scene types)", ...r });
  }

  if (mode === "creative" || mode === "both") {
    const r = await renderAndPoll("CREATIVE", "DynamicVideo", { code: CREATIVE_CODE });
    results.push({ label: "Creative (all modules)", ...r });
  }

  // Summary
  console.log("\n=== Results ===");
  for (const r of results) {
    const status = r.success ? "PASS" : "FAIL";
    console.log(`  [${status}] ${r.label}`);
    if (r.url) console.log(`         ${r.url}`);
    if (r.error) console.log(`         Error: ${r.error}`);
  }

  const allPassed = results.every((r) => r.success);
  process.exit(allPassed ? 0 : 1);
}

main();
