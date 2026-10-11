import type { Asset } from "../types";

export interface Signal {
  score: number; // 0-100 research priority (NOT a return forecast)
  reasons: string[];
  missing: string[];
}

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

/**
 * Research-priority score: fundamentals growing faster than attention/valuation.
 * Missing inputs are listed, never imputed.
 */
export function computeSignal(a: Asset): Signal {
  const reasons: string[] = [];
  const missing: string[] = [];
  let total = 0;
  let weight = 0;
  const add = (w: number, s: number) => { total += w * clamp(s); weight += w; };

  const growth = [a.tvlGrowth90d, a.revenueGrowth90d];
  const gVals = growth.map((x) => x.value).filter((v): v is number => v !== null);
  if (a.tvlGrowth90d.value === null) missing.push("TVL/usage growth");
  if (a.revenueGrowth90d.value === null) missing.push("Revenue growth");
  if (gVals.length) {
    const g = gVals.reduce((x, y) => x + y, 0) / gVals.length;
    add(35, g * 2);
    if (g >= 20) reasons.push(`Fundamentals growing ~${g.toFixed(0)}% over 90d`);
  }
  if (a.devActivity.value !== null) {
    add(15, a.devActivity.value);
    if (a.devActivity.value >= 70) reasons.push("High developer activity");
  } else missing.push("Developer activity");

  if (a.attention.value !== null) {
    add(20, 100 - a.attention.value);
    if (a.attention.value <= 45) reasons.push("Attention low relative to fundamentals");
  } else missing.push("Attention index");

  if (a.fdvToRevenue.value !== null) {
    add(15, 100 - a.fdvToRevenue.value);
    if (a.fdvToRevenue.value <= 25) reasons.push("Modest FDV/revenue multiple");
  } else missing.push("FDV/revenue");

  if (a.unlock12mPct.value !== null) {
    add(15, 100 - a.unlock12mPct.value * 3);
    if (a.unlock12mPct.value >= 20) reasons.push(`Dilution risk: ${a.unlock12mPct.value}% unlocks in 12m`);
  } else missing.push("Unlock schedule");

  if (a.valueCapture === "unclear") reasons.push("Tokenholder value capture unclear");
  const penalty = a.valueCapture === "unclear" ? 10 : 0;
  const base = weight ? total / weight : 0;
  // Penalise sparse evidence so low-data assets don't rank high.
  const coverage = weight / 100;
  return { score: Math.round(clamp(base * (0.5 + 0.5 * coverage) - penalty)), reasons, missing };
}
