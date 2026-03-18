import "./index.css";
import React from "react";
import { Composition } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import {
  SceneVideo,
  calculateTotalDuration,
  FPS,
  type SceneVideoProps,
} from "./compositions/SceneVideo";

const calculateMetadata: CalculateMetadataFunction<SceneVideoProps> = ({
  props,
}) => {
  return {
    durationInFrames: calculateTotalDuration(props.scenes),
    fps: FPS,
    width: 1920,
    height: 1080,
  };
};

const defaultScenes: SceneVideoProps["scenes"] = [
  {
    title: "Welcome to VidCraft AI",
    text: "Create stunning videos with the power of artificial intelligence",
    background:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    durationInFrames: 120,
  },
  {
    title: "Write Your Script",
    text: "Simply type your content and our AI handles the rest",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    durationInFrames: 120,
  },
  {
    title: "Export in HD",
    text: "Download your video in stunning 1080p quality, ready to share",
    background:
      "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)",
    durationInFrames: 120,
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SceneVideo"
        component={SceneVideo}
        durationInFrames={300}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={
          {
            scenes: defaultScenes,
          } satisfies SceneVideoProps
        }
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
