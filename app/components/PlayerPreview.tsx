"use client";

import { Player } from "@remotion/player";
import { SceneVideo } from "@/src/compositions/SceneVideo";
import { calculateTotalDuration, FPS, type SceneData } from "@/src/types";

export default function PlayerPreview({ scenes }: { scenes: SceneData[] }) {
  const totalFrames = calculateTotalDuration(scenes);

  return (
    <Player
      component={SceneVideo}
      durationInFrames={totalFrames}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={FPS}
      style={{
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
      }}
      controls
      inputProps={{ scenes }}
    />
  );
}
