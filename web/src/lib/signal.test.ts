import { describe, it, expect } from "vitest";
import { computeSignal } from "./signal";
import { applyFilters, defaultFilters } from "./filter";
import { sampleAssets } from "../data/sample";

describe("computeSignal", () => {
  it("is bounded and lists missing data without imputing", () => {
    const tao = sampleAssets.find((a) => a.id === "tao")!;
    const s = computeSignal(tao);
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
    expect(s.missing).toContain("Revenue growth");
    expect(s.missing).toContain("FDV/revenue");
  });
  it("flags unlock dilution", () => {
    const pump = sampleAssets.find((a) => a.id === "pump")!;
    expect(computeSignal(pump).reasons.join()).toMatch(/Dilution/);
  });
  it("marks all bundled data as sample", () => {
    for (const a of sampleAssets) expect(a.tvlGrowth90d.status).toBe("sample");
  });
});

describe("applyFilters", () => {
  it("filters by category and sorts by score desc", () => {
    const r = applyFilters(sampleAssets, { ...defaultFilters, category: "DeFi" });
    expect(r.every((a) => a.category === "DeFi")).toBe(true);
    const all = applyFilters(sampleAssets, defaultFilters).map((a) => computeSignal(a).score);
    expect([...all].sort((a, b) => b - a)).toEqual(all);
  });
  it("filters by search and attention", () => {
    expect(applyFilters(sampleAssets, { ...defaultFilters, query: "aave" })).toHaveLength(1);
    expect(applyFilters(sampleAssets, { ...defaultFilters, maxAttention: 40 }).every((a) => (a.attention.value ?? 0) <= 40)).toBe(true);
  });
});
