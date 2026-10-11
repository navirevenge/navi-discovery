import { SAMPLE_ASSETS } from "../data/sample";
import { researchSignal } from "./score";
import { applyFilters, DEFAULT_FILTERS } from "./filter";

const get = (id: string) => SAMPLE_ASSETS.find((a) => a.id === id)!;

describe("researchSignal", () => {
  it("scores within 0-100 and explains itself", () => {
    for (const a of SAMPLE_ASSETS) {
      const s = researchSignal(a);
      if (s.score !== null) { expect(s.score).toBeGreaterThanOrEqual(0); expect(s.score).toBeLessThanOrEqual(100); expect(s.reasons.length).toBeGreaterThan(0); }
    }
  });
  it("refuses to score with insufficient data and reports missing fields", () => {
    const s = researchSignal({ ...get("zec"), activeUsersGrowth90dPct: null });
    expect(s.score).toBeNull();
    expect(s.missing).toContain("TVL growth");
  });
  it("penalises dilution and weak value capture", () => {
    const base = get("aave");
    const worse = { ...base, unlock12mPct: 40, valueCapture: "none" as const };
    expect(researchSignal(worse).score!).toBeLessThan(researchSignal(base).score!);
  });
  it("marks every bundled asset as sample data", () => {
    for (const a of SAMPLE_ASSETS) expect(a.evidence.every((e) => e.provenance === "sample")).toBe(true);
  });
});

describe("applyFilters", () => {
  it("filters by category, attention and search", () => {
    expect(applyFilters(SAMPLE_ASSETS, { ...DEFAULT_FILTERS, category: "DeFi" }).map((a) => a.id)).toEqual(["aave"]);
    expect(applyFilters(SAMPLE_ASSETS, { ...DEFAULT_FILTERS, maxAttention: 30 }).every((a) => (a.attention ?? 0) <= 30)).toBe(true);
    expect(applyFilters(SAMPLE_ASSETS, { ...DEFAULT_FILTERS, query: "solana" })).toHaveLength(1);
  });
});
