import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { transform } from "sucrase";
import { getUser } from "@/lib/auth";
import { checkCredits, estimateMaxCredits, tokensToCredits, deductCredits } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/admin";

const SYSTEM_PROMPT = `You are a Remotion video component generator. You output ONLY valid TypeScript/JSX code — no markdown fences, no explanations, no commentary.

## Output Format
- First line: // DURATION: <total frames>
- Second line: // NARRATION: <voiceover text, one continuous paragraph, ~2-3 words per second>
- Then the code. Nothing else.

## Environment
This runs in a standard Remotion 4 project (1920×1080 at 30fps). You can write code exactly as you would in a local Remotion project with these available packages:

### Available Imports
- react (React, useState, useMemo, useCallback, useRef, etc.)
- remotion (AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Sequence, Series, Img, Audio, staticFile, etc.)
- @remotion/media (Audio)
- @remotion/sfx (whoosh, whip, pageTurn, uiSwitch, mouseClick, shutterModern, ding — these are URL strings, use as: <Audio src={whoosh} />)
- @remotion/transitions (TransitionSeries, linearTiming, springTiming)
- @remotion/transitions/fade (fade)
- @remotion/transitions/slide (slide)
- @remotion/paths (evolvePath, getLength, getPointAtLength, getTangentAtLength)

No other npm packages are available (no framer-motion, no lodash, no axios, etc.).

## Component Requirements
1. Export a default React functional component (no props)
2. All content is self-contained in the code

## Styling
- Tailwind CSS is available — you CAN use className with Tailwind utilities (e.g., className="flex items-center bg-black text-white p-4")
- Inline styles also work: style={{ ... }}
- Use whichever is more convenient. Both work.
- No CSS modules or external stylesheets.

## Animation Rules
- ALL motion/animation MUST be driven by useCurrentFrame() + interpolate() or spring()
- CSS transitions/animation/@keyframes are NOT supported by Remotion's renderer — they won't appear in the final video
- requestAnimationFrame, setTimeout, setInterval are forbidden
- interpolate() usage:
  interpolate(frame, [startFrame, endFrame], [startValue, endValue], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  Always include the clamp options.
- spring() usage:
  spring({ frame, fps, config: { damping: 200 } })
  spring({ frame: frame - delay, fps, config: { damping: 200 } })
  First argument is always an object.

## Sequencing (pick ONE approach per video)
Option A — <Sequence>:
  Each Sequence's "from" = previous "from" + previous "durationInFrames". No gaps, no overlaps.
  Inside Sequence, useCurrentFrame() returns LOCAL frame starting at 0.

Option B — <TransitionSeries> (preferred for multi-scene):
  Do NOT set "from" on TransitionSeries.Sequence — it auto-sequences.
  Do NOT mix with plain <Sequence>.

## Sound Effects
whoosh, whip, pageTurn, etc. from @remotion/sfx are URL strings.
Usage: <Audio src={whoosh} volume={0.2} />
Use sparingly — one per transition.

## SVG Animations
Use inline <svg> with viewBox. Animate via interpolate/spring on transform, opacity, stroke-dashoffset, etc.

## Path Animations
import { evolvePath } from '@remotion/paths';
const progress = interpolate(frame, [0, 2 * fps], [0, 1], { extrapolateRight: 'clamp' });
const evolved = evolvePath(progress, svgPathString);
<path d={svgPathString} strokeDasharray={evolved.strokeDasharray} strokeDashoffset={evolved.strokeDashoffset} />

## Content Guidelines
- Make it visually impressive and engaging
- Dark backgrounds (#0a0a0a, #0f0c29) with colored text
- ~4-6 seconds per section, animations spanning FULL section duration
- DURATION value MUST exactly match total frames
- NARRATION: natural spoken text fitting the video duration

## CRITICAL RULES
- The DURATION comment value must match the actual total content frames
- Every section must have animations spanning its FULL durationInFrames — no dead time
- Do NOT use CSS transition/animation/@keyframes — they won't render in the final video
- Do NOT import packages not listed above`;

function extractCode(text: string): string {
  // Try to find code within markdown fences
  const fenceMatch = text.match(/```(?:tsx?|jsx?|react)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  // If no fences found, assume the entire response is code
  return text.trim();
}

function extractDuration(code: string): number {
  const durationMatch = code.match(/\/\/\s*DURATION:\s*(\d+)/);
  if (durationMatch) {
    const parsed = parseInt(durationMatch[1], 10);
    if (parsed > 0 && parsed <= 9000) {
      return parsed;
    }
  }
  return 300;
}

function extractNarration(code: string): string {
  const match = code.match(/\/\/\s*NARRATION:\s*(.+)/);
  return match ? match[1].trim() : "";
}

/** Validate that the code compiles with Sucrase (same transforms as client DynamicRenderer) */
function validateCode(code: string): string | null {
  try {
    transform(code, {
      transforms: ["jsx", "typescript", "imports"],
      jsxRuntime: "classic",
    });
    return null; // no error
  } catch (e) {
    return e instanceof Error ? e.message : "Unknown compilation error";
  }
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: { topic?: string; model?: string; language?: string; targetDuration?: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  const { topic, model, language, targetDuration } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return NextResponse.json(
      { error: "A non-empty 'topic' field is required." },
      { status: 400 },
    );
  }

  const validDurations = [30, 60, 90, 120];
  const duration = targetDuration && validDurations.includes(targetDuration) ? targetDuration : null;
  const targetFrames = duration ? duration * 30 : null;

  let systemPrompt = SYSTEM_PROMPT;
  if (language) {
    systemPrompt += `\n\n## Language (CRITICAL)\nThe target language is ${language}. ALL visible text content (titles, labels, descriptions) and the NARRATION comment MUST be in ${language}, regardless of what language the user's input is in. Translate/adapt if needed. Keep code syntax, variable names, and imports in English.`;
  }

  let userMessage = `Create an animated Remotion video component about: ${topic.trim()}`;
  if (targetFrames && duration) {
    const sections = Math.max(3, Math.round(targetFrames / 120));
    userMessage += `\n\nTARGET DURATION: The video MUST be exactly ${targetFrames} frames (${duration} seconds at 30fps). Set "// DURATION: ${targetFrames}" at the top. Structure the video with ~${sections} sections to fill the full duration. Each section should have animations spanning its entire length — no dead time.`;
  }
  if (language) {
    userMessage += `\n\nIMPORTANT: All visible text and narration MUST be in ${language}. Translate the topic if it's in a different language.`;
  }

  // Pre-check: estimate max cost and verify user has enough credits
  const fullPrompt = systemPrompt + userMessage;
  // No artificial cap — longer videos just cost more credits.
  // 16384 is the model-max for Sonnet 4 / Opus 4.
  const maxOutputTokens = 16384;
  const estimatedCost = estimateMaxCredits(fullPrompt, maxOutputTokens);
  const { ok, balance } = await checkCredits(user.id, estimatedCost);
  if (!ok) {
    return NextResponse.json(
      { error: `Insufficient credits. Need ~${estimatedCost}, have ${balance}.` },
      { status: 403 },
    );
  }

  const modelId =
    model && typeof model === "string" ? model : "claude-sonnet-4-20250514";
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let code = "";
    const MAX_ATTEMPTS = 2;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const message = await client.messages.create({
        model: modelId,
        max_tokens: maxOutputTokens,
        system: systemPrompt,
        messages,
      });

      totalInputTokens += message.usage.input_tokens;
      totalOutputTokens += message.usage.output_tokens;

      const textBlock = message.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        return NextResponse.json(
          { error: "No text response received from AI." },
          { status: 500 },
        );
      }

      code = extractCode(textBlock.text);

      if (!code || code.length < 50) {
        return NextResponse.json(
          { error: "AI returned insufficient code. Please try again." },
          { status: 500 },
        );
      }

      // Validate syntax with Sucrase
      const compileError = validateCode(code);
      if (!compileError) break; // valid code, done

      if (attempt < MAX_ATTEMPTS - 1) {
        // Retry: send the error back to Claude for a fix
        messages.push(
          { role: "assistant", content: textBlock.text },
          { role: "user", content: `The code above has a compilation error:\n\n${compileError}\n\nPlease fix the error and return the COMPLETE corrected code. Same rules apply: no markdown fences, no explanations, just the raw code.` },
        );
        console.log(`Creative gen attempt ${attempt + 1} failed, retrying: ${compileError}`);
      } else {
        console.warn(`Creative gen failed after ${MAX_ATTEMPTS} attempts: ${compileError}`);
      }
    }

    // Deduct total cost for all attempts
    const actualCost = tokensToCredits(totalInputTokens, totalOutputTokens);
    const deductResult = await deductCredits(
      user.id, actualCost, "creative_gen",
      `creative generation (${totalInputTokens} in / ${totalOutputTokens} out)`,
    );

    if (!deductResult.success) {
      return NextResponse.json({ error: deductResult.error }, { status: 403 });
    }

    let durationInFrames = extractDuration(code);
    if (durationInFrames === 300 && targetFrames) {
      durationInFrames = targetFrames;
    }
    const narration = extractNarration(code);

    // Save project to database
    try {
      const supabase = createAdminClient();
      await supabase.from("projects").insert({
        user_id: user.id,
        title: topic.trim().slice(0, 100),
        mode: "creative",
        creative_code: code,
        status: "scripted",
      });
    } catch (dbErr) {
      console.error("Failed to save project:", dbErr);
    }

    return NextResponse.json({
      code, durationInFrames, narration,
      creditsUsed: actualCost,
      creditsRemaining: deductResult.balance,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error calling AI service.";
    console.error("Generate creative error:", message);
    return NextResponse.json(
      { error: `AI generation failed: ${message}` },
      { status: 500 },
    );
  }
}
