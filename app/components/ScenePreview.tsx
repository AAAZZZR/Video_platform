"use client";

import { Player } from "@remotion/player";
import { SceneVideo } from "@/src/compositions/SceneVideo";
import { FPS, type SceneData } from "@/src/types";

export default function ScenePreview({ scene }: { scene: SceneData }) {
  return (
    <Player
      component={SceneVideo}
      durationInFrames={scene.durationInFrames}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={FPS}
      style={{
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
      }}
      controls
      loop
      inputProps={{ scenes: [scene] }}
    />
  );
}
