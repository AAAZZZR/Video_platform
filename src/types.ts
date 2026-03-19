// ============================================================
// VidCraft AI — Shared Type System
// Used by: Remotion compositions, Next.js API, Frontend
// ============================================================

export const FPS = 30;
export const TRANSITION_FRAMES = 15;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

// ---- Scene Types ----

export type SceneType =
  | "title"
  | "text"
  | "bullets"
  | "table"
  | "chart-bar"
  | "stats"
  | "comparison"
  | "quote"
  | "code";

type BaseScene = {
  title: string;
  background: string;
  durationInFrames: number;
};

/** Hero title card — big title + subtitle */
export type TitleScene = BaseScene & {
  type: "title";
  subtitle: string;
};

/** Standard text — title + body paragraph */
export type TextScene = BaseScene & {
  type: "text";
  body: string;
};

/** Animated bullet points — items appear one by one */
export type BulletsScene = BaseScene & {
  type: "bullets";
  items: string[];
};

/** Data table with animated rows */
export type TableScene = BaseScene & {
  type: "table";
  headers: string[];
  rows: string[][];
};

/** Bar chart with spring-animated bars */
export type ChartBarScene = BaseScene & {
  type: "chart-bar";
  items: { label: string; value: number }[];
  unit?: string;
  maxValue?: number;
};

/** Big numbers with labels (e.g. "95%" → "Customer Satisfaction") */
export type StatsScene = BaseScene & {
  type: "stats";
  items: { value: string; label: string }[];
};

/** Two-column comparison (pros/cons, before/after) */
export type ComparisonScene = BaseScene & {
  type: "comparison";
  leftTitle: string;
  rightTitle: string;
  leftItems: string[];
  rightItems: string[];
};

/** Styled quotation with attribution */
export type QuoteScene = BaseScene & {
  type: "quote";
  quote: string;
  author: string;
};

/** Code snippet display */
export type CodeScene = BaseScene & {
  type: "code";
  code: string;
  language: string;
};

/** Discriminated union of all scene types */
export type SceneData =
  | TitleScene
  | TextScene
  | BulletsScene
  | TableScene
  | ChartBarScene
  | StatsScene
  | ComparisonScene
  | QuoteScene
  | CodeScene;

export type SceneVideoProps = {
  scenes: SceneData[];
};

// ---- Helpers ----

export const calculateTotalDuration = (scenes: SceneData[]): number => {
  const totalSceneFrames = scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );
  const transitionCount = Math.max(0, scenes.length - 1);
  return Math.max(1, totalSceneFrames - transitionCount * TRANSITION_FRAMES);
};

// ---- Background Presets ----

export const BACKGROUND_PRESETS = [
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
] as const;
