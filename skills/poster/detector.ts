import Anthropic from "@anthropic-ai/sdk";
import { POSTER_SKILLS, type PosterSkill } from "./schema";

const DETECTION_PROMPT = `You are a skill detector for a poster design system. Given a user's poster request, determine which design skills are needed.

Available skills:
- typography: Font choices, text hierarchy, sizing, weight combinations
- color-schemes: Color palettes, gradients, contrast, mood-based colors
- layout: Grid systems, alignment, composition, whitespace management
- imagery: Decorative elements, backgrounds, patterns, shapes, SVG graphics
- data-visualization: Charts, statistics, infographics, progress bars, comparisons
- event-poster: Event-specific design (dates, venues, speakers, schedules, RSVP)
- social-media: Platform-specific dimensions and best practices
- chinese-typography: CJK text handling, Chinese/Japanese font recommendations

Rules:
- Always include "typography", "color-schemes", and "layout" (they are fundamental)
- Add "imagery" if the poster needs decorative elements or visual flair
- Add "data-visualization" if the poster contains numbers, stats, comparisons, or charts
- Add "event-poster" if it's about an event, concert, conference, sale, or gathering
- Add "social-media" if a specific platform is mentioned
- Add "chinese-typography" if the content is in Chinese/Japanese/Korean

Return ONLY a JSON array of skill names. Example: ["typography","color-schemes","layout","imagery"]`;

/**
 * Detect which poster design skills are needed for a given request.
 * Uses Haiku (fast + cheap) for detection.
 */
export async function detectSkills(
  topic: string,
  apiKey: string,
): Promise<PosterSkill[]> {
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: DETECTION_PROMPT,
      messages: [{ role: "user", content: topic }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return ["typography", "color-schemes", "layout"];
    }

    const parsed = JSON.parse(textBlock.text);
    if (!Array.isArray(parsed)) {
      return ["typography", "color-schemes", "layout"];
    }

    // Filter to only valid skill names
    return parsed.filter((s: string) =>
      POSTER_SKILLS.includes(s as PosterSkill),
    ) as PosterSkill[];
  } catch (e) {
    console.error("Skill detection failed, using defaults:", e);
    return ["typography", "color-schemes", "layout"];
  }
}
