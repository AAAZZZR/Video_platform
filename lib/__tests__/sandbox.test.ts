import { describe, it, expect } from "vitest";
import { transform } from "sucrase";

/**
 * Test the sandbox compilation logic (same as DynamicRenderer/DynamicComposition).
 * Verifies that AI-generated code can be compiled and modules resolved.
 */

const MODULE_MAP: Record<string, unknown> = {
  "react": { createElement: () => null },
  "remotion": {
    AbsoluteFill: () => null,
    useCurrentFrame: () => 0,
    useVideoConfig: () => ({ fps: 30, width: 1920, height: 1080, durationInFrames: 300 }),
    interpolate: (v: number, i: number[], o: number[]) => o[0],
    spring: () => 0,
    Easing: {},
    Sequence: () => null,
    Audio: () => null,
  },
  "@remotion/media": { Audio: () => null },
  "@remotion/sfx": { whoosh: () => "", whip: () => "", pageTurn: () => "" },
  "@remotion/transitions": { TransitionSeries: () => null, linearTiming: () => ({}) },
  "@remotion/transitions/fade": { fade: () => ({}) },
  "@remotion/transitions/slide": { slide: () => ({}) },
  "@remotion/paths": { evolvePath: () => "", getLength: () => 0 },
};

function requireFn(mod: string): unknown {
  const resolved = MODULE_MAP[mod];
  if (resolved) return resolved;
  throw new Error(`Module "${mod}" is not available in sandbox`);
}

function compileCode(code: string) {
  const result = transform(code, {
    transforms: ["jsx", "typescript", "imports"],
    jsxRuntime: "classic",
  });
  const moduleObj: { exports: Record<string, unknown> } = { exports: {} };
  const factory = new Function("module", "exports", "require", "React", result.code);
  factory(moduleObj, moduleObj.exports, requireFn, MODULE_MAP["react"]);
  return moduleObj.exports;
}

describe("sandbox module resolution", () => {
  it("resolves react", () => {
    expect(requireFn("react")).toBeDefined();
  });

  it("resolves remotion", () => {
    expect(requireFn("remotion")).toBeDefined();
  });

  it("resolves @remotion/media", () => {
    expect(requireFn("@remotion/media")).toBeDefined();
  });

  it("resolves @remotion/sfx", () => {
    expect(requireFn("@remotion/sfx")).toBeDefined();
  });

  it("resolves @remotion/transitions", () => {
    expect(requireFn("@remotion/transitions")).toBeDefined();
  });

  it("resolves @remotion/transitions/fade", () => {
    expect(requireFn("@remotion/transitions/fade")).toBeDefined();
  });

  it("resolves @remotion/paths", () => {
    expect(requireFn("@remotion/paths")).toBeDefined();
  });

  it("throws for unknown modules", () => {
    expect(() => requireFn("fs")).toThrow('Module "fs" is not available in sandbox');
    expect(() => requireFn("path")).toThrow('Module "path" is not available in sandbox');
    expect(() => requireFn("child_process")).toThrow("not available in sandbox");
  });
});

describe("sandbox code compilation", () => {
  it("compiles a simple default export component", () => {
    const code = `
      import React from 'react';
      import { AbsoluteFill } from 'remotion';
      export default function MyVideo() {
        return null;
      }
    `;
    const exports = compileCode(code);
    expect(typeof exports.default).toBe("function");
  });

  it("compiles code with @remotion/media import", () => {
    const code = `
      import React from 'react';
      import { Audio } from '@remotion/media';
      export default function MyVideo() {
        return null;
      }
    `;
    const exports = compileCode(code);
    expect(typeof exports.default).toBe("function");
  });

  it("compiles code with @remotion/sfx import", () => {
    const code = `
      import React from 'react';
      import { whoosh } from '@remotion/sfx';
      export default function MyVideo() {
        return null;
      }
    `;
    const exports = compileCode(code);
    expect(typeof exports.default).toBe("function");
  });

  it("rejects code that imports forbidden modules", () => {
    // require() is called at module evaluation time inside the factory
    const code = `
      const fs = require('fs');
      export default function MyVideo() { return null; }
    `;
    expect(() => compileCode(code)).toThrow("not available in sandbox");
  });

  it("compiles named export MyComposition", () => {
    const code = `
      import React from 'react';
      export function MyComposition() { return null; }
    `;
    const exports = compileCode(code);
    expect(typeof exports.MyComposition).toBe("function");
  });
});
