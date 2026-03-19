import type { CaptionWord } from "@/src/types";

/**
 * Estimate word-level timestamps from narration text and audio duration.
 * Since Edge TTS doesn't provide word timestamps, we distribute time proportionally
 * based on character count (longer words get more time).
 */
export function estimateCaptions(
  narration: string,
  durationMs: number,
): CaptionWord[] {
  const words = narration.split(/\s+/).filter(Boolean);
  if (words.length === 0 || durationMs <= 0) return [];

  // Small padding at start/end for natural pacing
  const paddingMs = Math.min(200, durationMs * 0.05);
  const availableMs = durationMs - paddingMs * 2;

  // Weight by character length (longer words take more time to speak)
  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  let currentMs = paddingMs;

  return words.map((word) => {
    const wordDuration = (word.length / totalChars) * availableMs;
    const startMs = currentMs;
    const endMs = currentMs + wordDuration;
    currentMs = endMs;

    return {
      text: ` ${word}`, // leading space for whitespace-sensitive rendering
      startMs: Math.round(startMs),
      endMs: Math.round(endMs),
      timestampMs: Math.round(startMs),
      confidence: null,
    };
  });
}
