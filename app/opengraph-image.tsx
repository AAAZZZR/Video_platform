import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VidCraft AI — AI Video & Poster Generation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #1a1a2e 50%, #0f0c29 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 18,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            marginBottom: 32,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <polygon points="6,3 20,12 6,21" fill="white" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          VidCraft AI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          AI 影片與海報生成平台 — 從腳本到成品，幾秒完成
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
          {["影片模板", "自訂動畫", "語音旁白", "海報設計", "PPT 匯出"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  color: "#c4b5fd",
                  fontSize: 18,
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
