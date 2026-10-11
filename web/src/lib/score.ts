import type { CryptoAsset } from "./types";

export interface ResearchSignal {
  /** 0-100 research priority. NOT a return forecast. */
  score: number | null;
  reasons: string[];
  missing: string[];
}

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

/**
 * Explainable research-priority heuristic: fundamentals growing faster than
 * attention/valuation, penalised by dilution and weak value capture.
 * Returns score=null if too little data to score honestly.
 */
export function researchSignal(a: CryptoAsset): ResearchSignal {
  const missing: string[] = [];
  const reasons: string[] = [];
  const growth = [a.tvlGrowth90dPct, a.activeUsersGrowth90dPct, a.feesGrowth90dPct].filter(
    (v): v is number => v !== null,
  );
  if (a.tvlGrowth90dPct === null) missing.push("TVL growth");
  if (a.activeUsersGrowth90dPct === null) missing.push("Active users growth");
  if (a.feesGrowth90dPct === null) missing.push("Fees growth");
  if (a.attention === null) missing.push("Attention");
  if (a.fdvToFees === null) missing.push("FDV/fees valuation");
  if (a.unlock12mPct === null) missing.push("Unlock schedule");
  if (a.valueCapture === null) missing.push("Value capture");

  if (growth.length < 2 || a.attention === null) {
    return { score: null, reasons: ["Insufficient data to score"], missing };
  }

  const avgGrowth = growth.reduce((s, v) => s + v, 0) / growth.length;
  let score = 50 + clamp(avgGrowth, -50, 100) * 0.4;
  reasons.push(`Average 90d growth ${avgGrowth.toFixed(0)}%`);

  const gap = avgGrowth - a.attention;
  score += clamp(gap, -50, 50) * 0.3;
  reasons.push(gap > 0 ? "Growth outpaces attention" : "Attention outpaces growth");

  if (a.fdvToFees !== null && a.fdvToFees > 100) {
    score -= 10;
    reasons.push("Rich valuation (FDV/fees > 100)");
  }
  if (a.unlock12mPct !== null && a.unlock12mPct > 15) {
    score -= 10;
    reasons.push(`Dilution risk: ${a.unlock12mPct}% unlocks within 12m`);
  }
  if (a.valueCapture === "governance-only" || a.valueCapture === "none") {
    score -= 10;
    reasons.push("Weak tokenholder value capture");
  }
  return { score: Math.round(clamp(score)), reasons, missing };
}
