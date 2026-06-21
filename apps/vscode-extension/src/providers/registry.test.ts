import { describe, it, expect } from "vitest";
import { PROVIDERS } from "./registry";

const byId = (id: string) => {
  const p = PROVIDERS.find((x) => x.id === id);
  if (!p) throw new Error(`missing provider ${id}`);
  return p;
};

describe("provider registry", () => {
  it("defines the four expected providers", () => {
    expect(PROVIDERS.map((p) => p.id).sort()).toEqual([
      "claude",
      "deepseek",
      "gemini",
      "openai"
    ]);
  });

  it("accepts well-formed Claude keys and rejects others", () => {
    const claude = byId("claude");
    expect(claude.isLikelyValidFormat("sk-ant-api03-" + "a".repeat(30))).toBe(true);
    expect(claude.isLikelyValidFormat("sk-proj-abc123")).toBe(false);
    expect(claude.isLikelyValidFormat("")).toBe(false);
  });

  it("accepts well-formed OpenAI keys", () => {
    const openai = byId("openai");
    expect(openai.isLikelyValidFormat("sk-" + "a".repeat(40))).toBe(true);
    expect(openai.isLikelyValidFormat("AIza" + "b".repeat(40))).toBe(false);
    expect(openai.isLikelyValidFormat("sk-short")).toBe(false);
  });

  it("accepts well-formed Gemini keys", () => {
    const gemini = byId("gemini");
    expect(gemini.isLikelyValidFormat("AIza" + "c".repeat(35))).toBe(true);
    expect(gemini.isLikelyValidFormat("sk-ant-" + "c".repeat(35))).toBe(false);
  });

  it("accepts well-formed DeepSeek keys", () => {
    const deepseek = byId("deepseek");
    expect(deepseek.isLikelyValidFormat("sk-" + "d".repeat(40))).toBe(true);
    expect(deepseek.isLikelyValidFormat("nope")).toBe(false);
  });
});
