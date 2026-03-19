import { z } from "zod";

/** Validated output from the poster generation AI */
export const PosterOutputSchema = z.object({
  html: z.string().min(50, "HTML content too short"),
  width: z.number().int().min(200).max(4000),
  height: z.number().int().min(200).max(4000),
  title: z.string().min(1),
});

export type PosterOutput = z.infer<typeof PosterOutputSchema>;

/** Preset poster sizes */
export const POSTER_SIZES = [
  { id: "instagram-square", label: "Instagram Square", width: 1080, height: 1080 },
  { id: "instagram-story", label: "Instagram Story", width: 1080, height: 1920 },
  { id: "instagram-portrait", label: "Instagram Portrait", width: 1080, height: 1350 },
  { id: "facebook-post", label: "Facebook Post", width: 1200, height: 630 },
  { id: "linkedin-post", label: "LinkedIn Post", width: 1200, height: 627 },
  { id: "twitter-post", label: "Twitter / X Post", width: 1200, height: 675 },
  { id: "youtube-thumb", label: "YouTube Thumbnail", width: 1280, height: 720 },
  { id: "pinterest", label: "Pinterest Pin", width: 1000, height: 1500 },
  { id: "a4-portrait", label: "A4 Portrait", width: 794, height: 1123 },
  { id: "a4-landscape", label: "A4 Landscape", width: 1123, height: 794 },
  { id: "custom", label: "Custom", width: 1080, height: 1080 },
] as const;

/** Available poster skills */
export const POSTER_SKILLS = [
  "typography",
  "color-schemes",
  "layout",
  "imagery",
  "data-visualization",
  "event-poster",
  "social-media",
  "chinese-typography",
] as const;

export type PosterSkill = (typeof POSTER_SKILLS)[number];
