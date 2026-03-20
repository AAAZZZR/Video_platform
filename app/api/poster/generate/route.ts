import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { checkCredits, estimateMaxCredits, tokensToCredits, deductCredits } from "@/lib/credits";
import { BASE_SYSTEM_PROMPT } from "@/skills/poster/base-prompt";
import { detectSkills } from "@/skills/poster/detector";
import { loadSkills } from "@/skills/poster/loader";
import { PosterOutputSchema } from "@/skills/poster/schema";

const MAX_TOKENS = 8192;

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  let body: { topic?: string; model?: string; width?: number; height?: number; language?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { topic, model, width = 1080, height = 1080, language } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    // Step 1: Detect skills (fast, uses Haiku)
    const detectedSkills = await detectSkills(topic.trim(), apiKey);
    console.log("Detected skills:", detectedSkills);

    // Step 2: Load skill content
    const skillContent = loadSkills(detectedSkills);

    // Step 3: Construct full prompt
    let systemPrompt = BASE_SYSTEM_PROMPT + skillContent;

    if (language) {
      systemPrompt += `\n\n## Language\nAll text content MUST be in ${language}. Translate/adapt if the user's input is in a different language.`;
    }

    const userMessage = `Create a poster with these specifications:
- Size: ${width}x${height} pixels
- Content: ${topic.trim()}
${language ? `- Language: ${language}` : ""}

Remember: Return ONLY valid JSON with html, width, height, and title fields.`;

    // Pre-check: estimate max cost
    const fullPrompt = systemPrompt + userMessage;
    const estimatedCost = estimateMaxCredits(fullPrompt, MAX_TOKENS);
    const { ok, balance } = await checkCredits(user.id, estimatedCost);
    if (!ok) {
      return NextResponse.json(
        { error: `Insufficient credits. Need ~${estimatedCost}, have ${balance}.` },
        { status: 403 },
      );
    }

    // Step 4: Generate poster (main model)
    const modelId = model && typeof model === "string" ? model : "claude-sonnet-4-20250514";
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: modelId,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    // Deduct actual token cost
    const { input_tokens, output_tokens } = message.usage;
    const actualCost = tokensToCredits(input_tokens, output_tokens);
    const deductResult = await deductCredits(
      user.id, actualCost, "poster_gen",
      `poster generation (${input_tokens} in / ${output_tokens} out)`,
    );

    if (!deductResult.success) {
      return NextResponse.json({ error: deductResult.error }, { status: 403 });
    }

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // Step 5: Parse and validate
    let parsed: unknown;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: "AI returned no JSON" }, { status: 500 });
      }
    }

    const validated = PosterOutputSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Validation failed:", validated.error.issues);
      return NextResponse.json(
        { error: "AI output validation failed: " + validated.error.issues.map(i => i.message).join(", ") },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ...validated.data,
      detectedSkills,
      creditsUsed: actualCost,
      creditsRemaining: deductResult.balance,
    });
  } catch (err) {
    console.error("Poster generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 },
    );
  }
}
