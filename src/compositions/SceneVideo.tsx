import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

export type SceneData = {
  title: string;
  text: string;
  background: string;
  durationInFrames: number;
};

export type SceneVideoProps = {
  scenes: SceneData[];
};

export const TRANSITION_FRAMES = 15;
export const FPS = 30;

export const calculateTotalDuration = (scenes: SceneData[]): number => {
  const totalSceneFrames = scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );
  const transitionCount = Math.max(0, scenes.length - 1);
  return Math.max(1, totalSceneFrames - transitionCount * TRANSITION_FRAMES);
};

const SceneSlide: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { durationInFrames } = scene;

  const fadeInEnd = Math.floor(fps * 0.4);
  const fadeOutStart = durationInFrames - Math.floor(fps * 0.4);

  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleY = interpolate(frame, [0, fadeInEnd], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const textY = interpolate(frame, [5, fadeInEnd + 5], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const textOpacity = interpolate(frame, [5, fadeInEnd + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const decorLineWidth = interpolate(frame, [fadeInEnd, fadeInEnd + 15], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: scene.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div style={{ opacity, textAlign: "center", maxWidth: 1400 }}>
        <h1
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: 800,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transform: `translateY(${titleY}px)`,
            marginBottom: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {scene.title}
        </h1>

        <div
          style={{
            width: decorLineWidth,
            height: 4,
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 2,
            margin: "28px auto",
          }}
        />

        <p
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: 36,
            fontWeight: 400,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            lineHeight: 1.6,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {scene.text}
        </p>
      </div>

      {/* Scene number indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          right: 60,
          color: "rgba(255, 255, 255, 0.25)",
          fontSize: 18,
          fontFamily: "monospace",
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

export const SceneVideo: React.FC<SceneVideoProps> = ({ scenes }) => {
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill
        style={{
          background: "#0f0c29",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "white", fontSize: 36 }}>No scenes</p>
      </AbsoluteFill>
    );
  }

  const elements: React.ReactNode[] = [];

  scenes.forEach((scene, i) => {
    if (i > 0) {
      elements.push(
        <TransitionSeries.Transition
          key={`t-${i}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />,
      );
    }
    elements.push(
      <TransitionSeries.Sequence
        key={`s-${i}`}
        durationInFrames={scene.durationInFrames}
      >
        <SceneSlide scene={scene} />
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>{elements}</TransitionSeries>
    </AbsoluteFill>
  );
};
