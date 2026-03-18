"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { SceneData } from "@/src/compositions/SceneVideo";

const PlayerPreview = dynamic(
  () => import("@/app/components/PlayerPreview"),
  { ssr: false },
);

const COLOR_PRESETS = [
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  "linear-gradient(135deg, #c31432 0%, #240b36 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
];

const DEFAULT_SCENES: SceneData[] = [
  {
    title: "Welcome to VidCraft AI",
    text: "Create stunning videos with the power of artificial intelligence",
    background: COLOR_PRESETS[0],
    durationInFrames: 120,
  },
  {
    title: "Write Your Script",
    text: "Simply type your content and our AI handles the rest",
    background: COLOR_PRESETS[1],
    durationInFrames: 120,
  },
  {
    title: "Export in HD",
    text: "Download your video in stunning 1080p quality, ready to share",
    background: COLOR_PRESETS[2],
    durationInFrames: 120,
  },
];

type RenderState = "idle" | "rendering" | "done" | "error";

export default function Home() {
  const [scenes, setScenes] = useState<SceneData[]>(DEFAULT_SCENES);
  const [renderState, setRenderState] = useState<RenderState>("idle");
  const [renderId, setRenderId] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateScene = (
    index: number,
    field: keyof SceneData,
    value: string | number,
  ) => {
    setScenes((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const addScene = () => {
    setScenes((prev) => [
      ...prev,
      {
        title: "New Scene",
        text: "Enter your text here",
        background: COLOR_PRESETS[prev.length % COLOR_PRESETS.length],
        durationInFrames: 90,
      },
    ]);
  };

  const removeScene = (index: number) => {
    setScenes((prev) => prev.filter((_, i) => i !== index));
  };

  const startRender = async () => {
    setRenderState("rendering");
    setProgress(0);
    setOutputUrl(null);
    setError(null);

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start render");
      }

      const data = await res.json();
      setRenderId(data.renderId);
      setBucketName(data.bucketName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Render failed");
      setRenderState("error");
    }
  };

  const pollProgress = useCallback(async () => {
    if (!renderId || !bucketName) return;

    try {
      const res = await fetch(
        `/api/render-progress?renderId=${renderId}&bucketName=${bucketName}`,
      );
      const data = await res.json();

      if (data.fatalErrorEncountered) {
        setError("Render failed on Lambda");
        setRenderState("error");
        return;
      }

      setProgress(data.progress ?? 0);

      if (data.done) {
        setOutputUrl(data.outputUrl);
        setRenderState("done");
      }
    } catch {
      setError("Failed to check progress");
      setRenderState("error");
    }
  }, [renderId, bucketName]);

  useEffect(() => {
    if (renderState !== "rendering" || !renderId) return;

    const interval = setInterval(pollProgress, 1500);
    return () => clearInterval(interval);
  }, [renderState, renderId, pollProgress]);

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              VidCraft AI
            </span>
          </div>
          <span className="text-sm text-zinc-500">Beta</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Preview */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
            Preview
          </h2>
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black">
            <PlayerPreview scenes={scenes} />
          </div>
        </section>

        {/* Scene Editor */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
              Scenes ({scenes.length})
            </h2>
            <button
              onClick={addScene}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              + Add Scene
            </button>
          </div>

          <div className="space-y-4">
            {scenes.map((scene, index) => (
              <div
                key={index}
                className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-zinc-500">
                    SCENE {index + 1}
                  </span>
                  {scenes.length > 1 && (
                    <button
                      onClick={() => removeScene(index)}
                      className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={scene.title}
                      onChange={(e) =>
                        updateScene(index, "title", e.target.value)
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      step={0.5}
                      value={scene.durationInFrames / 30}
                      onChange={(e) =>
                        updateScene(
                          index,
                          "durationInFrames",
                          Math.round(parseFloat(e.target.value) * 30) || 30,
                        )
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Text
                  </label>
                  <textarea
                    value={scene.text}
                    onChange={(e) =>
                      updateScene(index, "text", e.target.value)
                    }
                    rows={2}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Background
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_PRESETS.map((preset, pi) => (
                      <button
                        key={pi}
                        onClick={() =>
                          updateScene(index, "background", preset)
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer transition-transform hover:scale-110"
                        style={{
                          background: preset,
                          outline:
                            scene.background === preset
                              ? "2px solid #3b82f6"
                              : "2px solid transparent",
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Render Section */}
        <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5">
            Render
          </h2>

          {renderState === "idle" && (
            <button
              onClick={startRender}
              disabled={scenes.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Render Video on Cloud
            </button>
          )}

          {renderState === "rendering" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Rendering...</span>
                <span className="text-sm font-mono text-zinc-400">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                Rendering on AWS Lambda — this usually takes 10-30 seconds
              </p>
            </div>
          )}

          {renderState === "done" && outputUrl && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-400 mb-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="font-medium">Render complete!</span>
              </div>
              <div className="flex gap-3 justify-center">
                <a
                  href={outputUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors inline-block"
                >
                  Download Video
                </a>
                <button
                  onClick={() => {
                    setRenderState("idle");
                    setRenderId(null);
                    setBucketName(null);
                    setProgress(0);
                    setOutputUrl(null);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  Render Again
                </button>
              </div>
            </div>
          )}

          {renderState === "error" && (
            <div>
              <div className="bg-red-950/50 border border-red-900 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
              <button
                onClick={() => {
                  setRenderState("idle");
                  setError(null);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-zinc-600 text-xs mt-16 pb-10">
          VidCraft AI — Powered by Remotion + AWS Lambda
        </footer>
      </main>
    </div>
  );
}
