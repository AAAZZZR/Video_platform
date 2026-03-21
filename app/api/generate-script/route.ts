import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { checkCredits, estimateMaxCredits, tokensToCredits, deductCredits } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/admin";

const BACKGROUNDS = [
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  "linear-gradient(135deg, #c31432 0%, #240b36 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "linear-gradient(135deg, #1d4350 0%, #a43931 100%)",
];

const SYSTEM_PROMPT = `You are a professional video script generator for VidCraft AI. Your job is to take a topic and produce a structured JSON script that drives an automated video rendering engine.

You MUST respond with ONLY valid JSON — no markdown fences, no explanations, no commentary. Just the raw JSON object.

## Response Format

Return a JSON object with a single key "scenes" containing an array of scene objects:

{"scenes": [ ... ]}

## Available Scene Types

You have 9 scene types to work with. Each scene object must include "type", "background", and "durationInFrames", plus the type-specific fields listed below.

### 1. title
Opening/section title card.
Fields: type, title (string), subtitle (string), narration (string), background, durationInFrames
durationInFrames: 120 (4 seconds at 30fps)

### 2. text
A single block of explanatory text.
Fields: type, title (string), body (string), narration (string), background, durationInFrames
durationInFrames: 150 (5 seconds)

### 3. bullets
A list of bullet points.
Fields: type, title (string), items (string[], 3-5 items max), narration (string), background, durationInFrames
durationInFrames: 150-180 (scale with item count: 3 items=150, 4 items=165, 5 items=180)

### 4. table
Tabular data display.
Fields: type, title (string), headers (string[], 2-4 columns), rows (string[][], 3-5 rows max), narration (string), background, durationInFrames
durationInFrames: 180 (6 seconds)

### 5. chart-bar
A bar chart visualization.
Fields: type, title (string), items (array of {label: string, value: number}, 4-6 items), unit (string, optional, e.g. "%", "M", "$"), maxValue (number, optional), narration (string), background, durationInFrames
durationInFrames: 180 (6 seconds)

### 6. stats
Key statistics or metrics display.
Fields: type, title (string), items (array of {value: string, label: string}, 2-4 items), narration (string), background, durationInFrames
durationInFrames: 150 (5 seconds)

### 7. comparison
Side-by-side comparison.
Fields: type, title (string), leftTitle (string), rightTitle (string), leftItems (string[], 3-5 items), rightItems (string[], 3-5 items, same count as leftItems), narration (string), background, durationInFrames
durationInFrames: 180 (6 seconds)

### 8. quote
A quotation with attribution.
Fields: type, title (string), quote (string), author (string), narration (string), background, durationInFrames
durationInFrames: 120 (4 seconds)

### 9. code
A code snippet.
Fields: type, title (string), code (string, 5-15 lines), language (string, e.g. "typescript", "python"), narration (string), background, durationInFrames
durationInFrames: 180 (6 seconds)

## Background Options

Pick a DIFFERENT background for each scene from this list for visual variety:
${BACKGROUNDS.map((bg, i) => `${i + 1}. "${bg}"`).join("\n")}

## Guidelines

1. ALWAYS start with a "title" scene as the video opener.
2. Use a VARIETY of scene types — never use the same type for two consecutive scenes. Aim for at least 4-5 different scene types per script.
3. Pick a different background gradient for each scene to keep the video visually interesting.
4. Keep all text CONCISE. This is video content, not a blog post. Use short, punchy sentences that can be read quickly on screen.
5. For bullets: max 8 words per bullet point.
6. For tables: keep cell text brief (1-3 words per cell ideally).
7. For chart data: use realistic, plausible numbers that illustrate the point.
8. For stats: use impactful numbers with concise labels.
9. For code: keep it minimal — demonstrate the concept with the fewest lines possible.
10. For quotes: use real, well-known quotes when relevant, or craft insightful original ones.
11. The video rendering is at 30 FPS, so 30 frames = 1 second.
12. Make the content educational, engaging, and well-structured — as if it were a professional explainer video.
13. Every scene MUST include a 'narration' field with natural spoken text for voiceover. The narration should describe or complement what's shown visually. Keep narration concise: aim for about 2-3 words per second of scene duration. For a 5-second scene (150 frames), write about 10-15 words of narration.

## Language (CRITICAL)

The user will specify a target language. You MUST generate ALL visible text and narration in that language, regardless of what language the user's topic/input is written in. This includes: titles, subtitles, body text, bullet items, table headers, table cells, chart labels, stat values/labels, comparison items, quotes, and narration. The only things that stay in English are JSON keys and code snippets.

For example, if the user writes the topic in Chinese but the target language is English, translate and adapt all content to English. If the topic is in English but the target language is Traditional Chinese, write everything in Traditional Chinese.`;

function extractJSON(text: string): unknown {
  // First, try parsing the entire response as JSON
  try {
    return JSON.parse(text);
  } catch {
    // ignore
  }

  // Try to find JSON within markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // ignore
    }
  }

  // Try to find a JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // ignore
    }
  }

  return null;
}

const MAX_TOKENS = 4096;

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

  let body: { topic?: string; sceneCount?: number; language?: string; model?: string; targetDuration?: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  const { topic, sceneCount, language, model, targetDuration } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return NextResponse.json(
      { error: "A non-empty 'topic' field is required." },
      { status: 400 },
    );
  }

  const validDurations = [30, 60, 90, 120];
  const duration = targetDuration && validDurations.includes(targetDuration) ? targetDuration : null;
  const count = duration
    ? Math.min(15, Math.max(3, Math.round(duration / 8)))
    : (sceneCount && sceneCount >= 3 && sceneCount <= 15 ? sceneCount : 7);

  let userMessage = `Create a ${count}-scene video script about: ${topic.trim()}`;
  if (duration) {
    const avgPerScene = Math.round(duration / count);
    userMessage += `\n\nTARGET DURATION: The total video should be approximately ${duration} seconds (${duration * 30} frames at 30fps). With ${count} scenes, aim for roughly ${avgPerScene} seconds (${avgPerScene * 30} frames) per scene. Adjust durationInFrames for each scene accordingly — title/quote scenes can be shorter (~${Math.max(3, avgPerScene - 2)}s), content-heavy scenes like tables/charts/comparisons can be longer (~${avgPerScene + 2}s). The sum of all durationInFrames should be close to ${duration * 30} frames total.`;
  }
  if (language) {
    userMessage += `\n\nIMPORTANT: The target language is ${language}. ALL text content (titles, body, bullets, table data, stats, narration, quotes — everything the viewer sees or hears) MUST be in ${language}. Translate/adapt the topic if it is in a different language.`;
  }

  // Pre-check: estimate max cost
  const fullPrompt = SYSTEM_PROMPT + userMessage;
  const estimatedCost = estimateMaxCredits(fullPrompt, MAX_TOKENS);
  const { ok, balance } = await checkCredits(user.id, estimatedCost);
  if (!ok) {
    return NextResponse.json(
      { error: `Insufficient credits. Need ~${estimatedCost}, have ${balance}.` },
      { status: 403 },
    );
  }

  const modelId = model && typeof model === "string" ? model : "claude-sonnet-4-20250514";
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: modelId,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    // Deduct actual token cost
    const { input_tokens, output_tokens } = message.usage;
    const actualCost = tokensToCredits(input_tokens, output_tokens);
    const deductResult = await deductCredits(
      user.id, actualCost, "script_gen",
      `script generation (${input_tokens} in / ${output_tokens} out)`,
    );

    if (!deductResult.success) {
      return NextResponse.json({ error: deductResult.error }, { status: 403 });
    }

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response received from AI." },
        { status: 500 },
      );
    }

    const parsed = extractJSON(textBlock.text);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray((parsed as { scenes?: unknown }).scenes)
    ) {
      return NextResponse.json(
        { error: "AI returned an invalid script format. Please try again." },
        { status: 500 },
      );
    }

    // Save project to database
    try {
      const supabase = createAdminClient();
      await supabase.from("projects").insert({
        user_id: user.id,
        title: topic.trim().slice(0, 100),
        mode: "template",
        script_data: parsed,
        status: "scripted",
      });
    } catch (dbErr) {
      console.error("Failed to save project:", dbErr);
    }

    return NextResponse.json({
      ...parsed as object,
      creditsUsed: actualCost,
      creditsRemaining: deductResult.balance,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error calling AI service.";
    console.error("Generate script error:", message);
    return NextResponse.json(
      { error: `AI generation failed: ${message}` },
      { status: 500 },
    );
  }
}
