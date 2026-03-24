import { z } from "zod";

// ---- Element Schemas ----

const TextElementSchema = z.object({
  type: z.literal("text"),
  text: z.string().min(1),
  left: z.number(),
  top: z.number(),
  fontSize: z.number().min(8).max(400),
  fontFamily: z.string(),
  fill: z.string(),
  fontWeight: z.string().optional(),
  fontStyle: z.string().optional(),
  textAlign: z.string().optional(),
  underline: z.boolean().optional(),
  width: z.number().optional(),
  lineHeight: z.number().optional(),
  charSpacing: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  angle: z.number().optional(),
});

const RectElementSchema = z.object({
  type: z.literal("rect"),
  left: z.number(),
  top: z.number(),
  width: z.number().min(1),
  height: z.number().min(1),
  fill: z.string(),
  rx: z.number().optional(),
  ry: z.number().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  angle: z.number().optional(),
});

const CircleElementSchema = z.object({
  type: z.literal("circle"),
  left: z.number(),
  top: z.number(),
  radius: z.number().min(1),
  fill: z.string(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

const LineElementSchema = z.object({
  type: z.literal("line"),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  stroke: z.string(),
  strokeWidth: z.number().min(0.5),
  opacity: z.number().min(0).max(1).optional(),
});

const PosterElementSchema = z.discriminatedUnion("type", [
  TextElementSchema,
  RectElementSchema,
  CircleElementSchema,
  LineElementSchema,
]);

// ---- Output Schema ----

export const PosterOutputSchema = z.object({
  title: z.string().min(1),
  width: z.number().int().min(200).max(4000),
  height: z.number().int().min(200).max(4000),
  background: z.string().min(1),
  elements: z.array(PosterElementSchema).min(1),
});

export type PosterOutput = z.infer<typeof PosterOutputSchema>;
export type PosterElement = z.infer<typeof PosterElementSchema>;

// ---- Preset Sizes ----

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

// ---- Skills ----

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

// ---- Available Fonts ----

export const POSTER_FONTS = [
  { family: "Inter", weights: [400, 700, 900] },
  { family: "Playfair Display", weights: [400, 700] },
  { family: "Montserrat", weights: [400, 700] },
  { family: "DM Sans", weights: [400, 700] },
  { family: "Noto Sans TC", weights: [400, 700] },
  { family: "Noto Serif TC", weights: [400, 700] },
] as const;

export const SYSTEM_FONTS = ["Arial", "Courier New"] as const;
