import { describe, it, expect } from "vitest";
import { estimateInputTokens, tokensToCredits, estimateMaxCredits } from "../credits";

describe("estimateInputTokens", () => {
  it("estimates English text (~4 chars/token, using 2.5 as conservative)", () => {
    const text = "Hello world"; // 11 chars
    expect(estimateInputTokens(text)).toBe(Math.ceil(11 / 2.5)); // 5
  });

  it("estimates CJK text (shorter per token)", () => {
    const text = "你好世界測試"; // 6 chars
    expect(estimateInputTokens(text)).toBe(Math.ceil(6 / 2.5)); // 3
  });

  it("handles empty string", () => {
    expect(estimateInputTokens("")).toBe(0);
  });

  it("estimates a typical system prompt (~5000 chars)", () => {
    const prompt = "x".repeat(5000);
    expect(estimateInputTokens(prompt)).toBe(2000);
  });
});

describe("tokensToCredits", () => {
  it("calculates credits from token usage (input=0.5/1K, output=2.0/1K)", () => {
    // 2000 input + 3000 output
    // = (2000/1000)*0.5 + (3000/1000)*2.0 = 1 + 6 = 7
    expect(tokensToCredits(2000, 3000)).toBe(7);
  });

  it("enforces minimum of 1 credit", () => {
    // Very small usage: 10 input + 10 output
    // = (10/1000)*0.5 + (10/1000)*2.0 = 0.005 + 0.02 = 0.025 → ceil = 1 (min)
    expect(tokensToCredits(10, 10)).toBe(1);
  });

  it("rounds up to next integer", () => {
    // 1000 input + 1000 output
    // = (1000/1000)*0.5 + (1000/1000)*2.0 = 0.5 + 2.0 = 2.5 → ceil = 3
    expect(tokensToCredits(1000, 1000)).toBe(3);
  });

  it("handles zero tokens", () => {
    expect(tokensToCredits(0, 0)).toBe(1); // minimum
  });

  it("typical script generation (~2K in, ~3K out)", () => {
    const credits = tokensToCredits(2000, 3000);
    expect(credits).toBe(7);
  });

  it("typical creative generation (~5K in, ~6K out)", () => {
    // (5000/1000)*0.5 + (6000/1000)*2.0 = 2.5 + 12 = 14.5 → ceil = 15
    const credits = tokensToCredits(5000, 6000);
    expect(credits).toBe(15);
  });

  it("max output scenario (8192 output tokens)", () => {
    // (5000/1000)*0.5 + (8192/1000)*2.0 = 2.5 + 16.384 = 18.884 → ceil = 19
    const credits = tokensToCredits(5000, 8192);
    expect(credits).toBe(19);
  });
});

describe("estimateMaxCredits", () => {
  it("estimates worst-case cost for pre-check", () => {
    // 2500 char prompt → 1000 estimated input tokens
    // max output = 4096
    // = (1000/1000)*0.5 + (4096/1000)*2.0 = 0.5 + 8.192 = 8.692 → ceil = 9
    const prompt = "x".repeat(2500);
    expect(estimateMaxCredits(prompt, 4096)).toBe(9);
  });

  it("estimates creative mode worst case (large prompt + 8192 max)", () => {
    // 5000 char prompt → 2000 estimated input tokens
    // max output = 8192
    // = (2000/1000)*0.5 + (8192/1000)*2.0 = 1 + 16.384 = 17.384 → ceil = 18
    const prompt = "x".repeat(5000);
    expect(estimateMaxCredits(prompt, 8192)).toBe(18);
  });

  it("actual cost is always <= estimated max", () => {
    const prompt = "x".repeat(5000);
    const maxTokens = 8192;
    const estimated = estimateMaxCredits(prompt, maxTokens);

    // Simulate actual usage (always less than max)
    const actualOutput = 4000; // much less than 8192
    const actualInput = 2000;
    const actual = tokensToCredits(actualInput, actualOutput);

    expect(actual).toBeLessThanOrEqual(estimated);
  });

  it("free plan (30 credits) can afford basic script gen", () => {
    // Script gen: ~3000 char prompt, max 4096 output
    const prompt = "x".repeat(3000);
    const estimated = estimateMaxCredits(prompt, 4096);
    expect(estimated).toBeLessThanOrEqual(30);
  });
});
