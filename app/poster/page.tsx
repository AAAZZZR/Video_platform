"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { POSTER_SIZES } from "@/skills/poster/schema";
import { MODEL_OPTIONS } from "@/src/types";

export default function PosterPage() {
  const [topic, setTopic] = useState("");
  const [selectedSize, setSelectedSize] = useState<(typeof POSTER_SIZES)[number]>(POSTER_SIZES[0]);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4-20250514");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterHtml, setPosterHtml] = useState<string | null>(null);
  const [posterTitle, setPosterTitle] = useState("");
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [posterWidth, setPosterWidth] = useState(1080);
  const [posterHeight, setPosterHeight] = useState(1080);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const width = selectedSize.id === "custom" ? customWidth : selectedSize.width;
  const height = selectedSize.id === "custom" ? customHeight : selectedSize.height;

  const generatePoster = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setError(null);
    setPosterHtml(null);

    try {
      const res = await fetch("/api/poster/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, model: selectedModel, width, height }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setPosterHtml(data.html);
      setPosterTitle(data.title || "poster");
      setPosterWidth(data.width);
      setPosterHeight(data.height);
      setDetectedSkills(data.detectedSkills || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate poster");
    } finally {
      setGenerating(false);
    }
  };

  const getLiveHtml = (): string => {
    // Read current DOM from iframe (includes user edits)
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      const el = iframeDoc.querySelector("[data-poster]") as HTMLElement;
      if (el) return el.innerHTML;
    }
    return posterHtml || "";
  };

  const downloadHtml = () => {
    const html = getLiveHtml();
    if (!html) return;
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#111">
${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${posterTitle || "poster"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = async () => {
    if (!iframeRef.current) return;
    try {
      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) return;
      const posterEl = iframeDoc.querySelector("[data-poster]") as HTMLElement;
      if (!posterEl) return;
      const dataUrl = await toPng(posterEl, { width: posterWidth, height: posterHeight, pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${posterTitle || "poster"}.png`;
      a.click();
    } catch (err) {
      console.error("PNG download failed:", err);
      alert("PNG download failed. Try downloading as HTML instead.");
    }
  };

  const iframeSrcdoc = posterHtml
    ? `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#09090b}
[data-poster] *:hover{outline:1px dashed rgba(255,255,255,0.3);outline-offset:2px;cursor:text}
[data-poster] *:focus{outline:2px solid rgba(59,130,246,0.6);outline-offset:2px}
</style>
</head>
<body>
<div data-poster="true" contenteditable="true" spellcheck="false">${posterHtml}</div>
</body>
</html>`
    : "";

  // Scale factor for preview
  const maxPreviewWidth = 800;
  const scale = posterWidth > maxPreviewWidth ? maxPreviewWidth / posterWidth : 1;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">VidCraft AI</span>
            </a>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/create" className="text-sm text-zinc-400 hover:text-white transition-colors">Video</a>
            <span className="text-sm text-white font-medium px-3 py-2 rounded-lg bg-zinc-800">Poster</span>
            <a href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Input Section */}
        <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create Poster</h2>
          <div className="space-y-4">
            {/* Topic */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Describe your poster</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. A music festival poster for 'Summer Beats 2026' on August 15 at Taipei Arena, featuring DJ Shadow and Aurora"
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Size + Model row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Size selector */}
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Size</label>
                <select
                  value={selectedSize.id}
                  onChange={(e) => {
                    const found = POSTER_SIZES.find((s) => s.id === e.target.value);
                    if (found) setSelectedSize(found);
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {POSTER_SIZES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.width}x{s.height})
                    </option>
                  ))}
                </select>
                {selectedSize.id === "custom" && (
                  <div className="flex gap-2 mt-2">
                    <input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white" placeholder="Width" />
                    <span className="text-zinc-500 self-center">x</span>
                    <input type="number" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white" placeholder="Height" />
                  </div>
                )}
              </div>

              {/* Model selector */}
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">AI Model</label>
                <div className="flex gap-2">
                  {MODEL_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                        selectedModel === m.id
                          ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-950/50 border border-red-900 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generatePoster}
              disabled={generating || !topic.trim()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating poster...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  Generate Poster
                </>
              )}
            </button>
          </div>
        </section>

        {/* Detected Skills */}
        {detectedSkills.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-600">Skills used:</span>
            {detectedSkills.map((skill) => (
              <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Preview */}
        {posterHtml && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Preview</h2>
              <div className="flex gap-2">
                <button onClick={downloadHtml} className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  HTML
                </button>
                <button onClick={downloadPng} className="text-sm bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  PNG
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#09090b] flex justify-center py-8">
              <div style={{ width: posterWidth * scale, height: posterHeight * scale, overflow: "hidden" }}>
                <iframe
                  ref={iframeRef}
                  srcDoc={iframeSrcdoc}
                  style={{
                    width: posterWidth,
                    height: posterHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    border: "none",
                  }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-zinc-600 text-xs mt-16 pb-10">
          VidCraft AI — Poster Generator
        </footer>
      </main>
    </div>
  );
}
