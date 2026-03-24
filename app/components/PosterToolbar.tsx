"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type * as fabric from "fabric";
import { POSTER_FONTS, SYSTEM_FONTS } from "@/skills/poster/schema";

const ALL_FONTS = [...POSTER_FONTS.map((f) => f.family), ...SYSTEM_FONTS];

type Props = {
  canvas: fabric.Canvas | null;
};

export default function PosterToolbar({ canvas }: Props) {
  const [selected, setSelected] = useState<fabric.FabricObject | null>(null);
  const [selType, setSelType] = useState<"text" | "shape" | null>(null);

  // Text properties
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(24);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState("left");

  // Shape properties
  const [fillColor, setFillColor] = useState("#3b82f6");

  // Undo/Redo
  const history = useRef<string[]>([]);
  const historyIdx = useRef(-1);
  const skipSave = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveState = useCallback(() => {
    if (!canvas || skipSave.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const json = JSON.stringify(canvas.toJSON());
      // Trim future states if we're not at the end
      history.current = history.current.slice(0, historyIdx.current + 1);
      history.current.push(json);
      if (history.current.length > 30) history.current.shift();
      historyIdx.current = history.current.length - 1;
    }, 300);
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas || historyIdx.current <= 0) return;
    historyIdx.current--;
    skipSave.current = true;
    canvas.loadFromJSON(history.current[historyIdx.current]).then(() => {
      canvas.renderAll();
      skipSave.current = false;
    });
  }, [canvas]);

  const redo = useCallback(() => {
    if (!canvas || historyIdx.current >= history.current.length - 1) return;
    historyIdx.current++;
    skipSave.current = true;
    canvas.loadFromJSON(history.current[historyIdx.current]).then(() => {
      canvas.renderAll();
      skipSave.current = false;
    });
  }, [canvas]);

  // Sync selection
  const syncFromSelection = useCallback((obj: fabric.FabricObject | null) => {
    setSelected(obj);
    if (!obj) {
      setSelType(null);
      return;
    }
    if (obj.type === "textbox" || obj.type === "text") {
      setSelType("text");
      const t = obj as fabric.Textbox;
      setFontFamily(t.fontFamily || "Inter");
      setFontSize(t.fontSize || 24);
      setBold(t.fontWeight === "bold" || Number(t.fontWeight) >= 700);
      setItalic(t.fontStyle === "italic");
      setUnderline(!!t.underline);
      setTextColor((t.fill as string) || "#ffffff");
      setTextAlign(t.textAlign || "left");
    } else {
      setSelType("shape");
      setFillColor((obj.fill as string) || "#3b82f6");
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const onSelect = () => syncFromSelection(canvas.getActiveObject() ?? null);
    const onClear = () => syncFromSelection(null);

    canvas.on("selection:created", onSelect);
    canvas.on("selection:updated", onSelect);
    canvas.on("selection:cleared", onClear);
    canvas.on("object:modified", saveState);
    canvas.on("object:added", saveState);
    canvas.on("object:removed", saveState);

    // Save initial state
    saveState();

    return () => {
      canvas.off("selection:created", onSelect);
      canvas.off("selection:updated", onSelect);
      canvas.off("selection:cleared", onClear);
      canvas.off("object:modified", saveState);
      canvas.off("object:added", saveState);
      canvas.off("object:removed", saveState);
    };
  }, [canvas, syncFromSelection, saveState]);

  // ---- Actions ----

  const addText = () => {
    if (!canvas) return;
    // Dynamic import to avoid SSR issues
    import("fabric").then(({ Textbox }) => {
      const obj = new Textbox("New Text", {
        left: canvas.width! / 2 - 100,
        top: canvas.height! / 2 - 20,
        fontSize: 32,
        fontFamily: "Inter",
        fill: "#ffffff",
        width: 200,
        textAlign: "center",
      });
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    });
  };

  const addRect = () => {
    if (!canvas) return;
    import("fabric").then(({ Rect }) => {
      const obj = new Rect({
        left: canvas.width! / 2 - 75,
        top: canvas.height! / 2 - 50,
        width: 150,
        height: 100,
        fill: "#3b82f6",
        rx: 8,
        ry: 8,
      });
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    });
  };

  const addCircle = () => {
    if (!canvas) return;
    import("fabric").then(({ Circle }) => {
      const obj = new Circle({
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 50,
        radius: 50,
        fill: "#8b5cf6",
      });
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    });
  };

  const deleteSelected = () => {
    if (!canvas || !selected) return;
    canvas.remove(selected);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const bringToFront = () => {
    if (!canvas || !selected) return;
    canvas.bringObjectToFront(selected);
    canvas.renderAll();
  };

  const sendToBack = () => {
    if (!canvas || !selected) return;
    canvas.sendObjectToBack(selected);
    canvas.renderAll();
  };

  // ---- Text Setters ----

  const setTextProp = (prop: string, value: unknown) => {
    if (!selected || selType !== "text") return;
    (selected as fabric.Textbox).set(prop as keyof fabric.Textbox, value as never);
    canvas?.renderAll();
    saveState();
  };

  const setShapeFill = (color: string) => {
    if (!selected || selType !== "shape") return;
    selected.set("fill", color);
    canvas?.renderAll();
    setFillColor(color);
    saveState();
  };

  const btnBase = "px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer";
  const btnActive = "bg-blue-600 text-white";
  const btnIdle = "bg-zinc-700 text-zinc-300 hover:bg-zinc-600";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
      {/* Row 1: Add elements + Undo/Redo */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={addText} className={`${btnBase} ${btnIdle}`}>+ Text</button>
        <button onClick={addRect} className={`${btnBase} ${btnIdle}`}>+ Rect</button>
        <button onClick={addCircle} className={`${btnBase} ${btnIdle}`}>+ Circle</button>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        <button onClick={undo} className={`${btnBase} ${btnIdle}`} title="Undo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h13a4 4 0 010 8H7" /><path d="M3 10l4-4M3 10l4 4" /></svg>
        </button>
        <button onClick={redo} className={`${btnBase} ${btnIdle}`} title="Redo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H8a4 4 0 000 8h9" /><path d="M21 10l-4-4M21 10l-4 4" /></svg>
        </button>

        {selected && (
          <>
            <div className="w-px h-5 bg-zinc-700 mx-1" />
            <button onClick={bringToFront} className={`${btnBase} ${btnIdle}`} title="Bring to Front">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="14" height="14" rx="2" /><rect x="2" y="8" width="14" height="14" rx="2" opacity="0.4" /></svg>
            </button>
            <button onClick={sendToBack} className={`${btnBase} ${btnIdle}`} title="Send to Back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="14" height="14" rx="2" opacity="0.4" /><rect x="8" y="8" width="14" height="14" rx="2" /></svg>
            </button>
            <button onClick={deleteSelected} className={`${btnBase} bg-red-900/60 text-red-300 hover:bg-red-800`} title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </button>
          </>
        )}
      </div>

      {/* Row 2: Text formatting */}
      {selType === "text" && (
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={fontFamily}
            onChange={(e) => { setFontFamily(e.target.value); setTextProp("fontFamily", e.target.value); }}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {ALL_FONTS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <input
            type="number"
            min={8}
            max={400}
            value={fontSize}
            onChange={(e) => { const v = parseInt(e.target.value) || 24; setFontSize(v); setTextProp("fontSize", v); }}
            className="w-16 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />

          <button onClick={() => { const v = !bold; setBold(v); setTextProp("fontWeight", v ? "bold" : "normal"); }} className={`${btnBase} ${bold ? btnActive : btnIdle} font-bold`}>B</button>
          <button onClick={() => { const v = !italic; setItalic(v); setTextProp("fontStyle", v ? "italic" : "normal"); }} className={`${btnBase} ${italic ? btnActive : btnIdle} italic`}>I</button>
          <button onClick={() => { const v = !underline; setUnderline(v); setTextProp("underline", v); }} className={`${btnBase} ${underline ? btnActive : btnIdle} underline`}>U</button>

          <div className="w-px h-5 bg-zinc-700 mx-0.5" />

          <input
            type="color"
            value={textColor}
            onChange={(e) => { setTextColor(e.target.value); setTextProp("fill", e.target.value); }}
            className="w-7 h-7 rounded cursor-pointer border border-zinc-700 bg-transparent"
          />

          <div className="w-px h-5 bg-zinc-700 mx-0.5" />

          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => { setTextAlign(align); setTextProp("textAlign", align); }}
              className={`${btnBase} ${textAlign === align ? btnActive : btnIdle}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {align === "left" && <><path d="M3 6h18M3 12h12M3 18h16" /></>}
                {align === "center" && <><path d="M3 6h18M6 12h12M4 18h16" /></>}
                {align === "right" && <><path d="M3 6h18M9 12h12M5 18h16" /></>}
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Row 3: Shape formatting */}
      {selType === "shape" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Fill</span>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setShapeFill(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border border-zinc-700 bg-transparent"
          />
        </div>
      )}
    </div>
  );
}
