import type { CryptoAsset, CryptoCategory } from "./types";
import { researchSignal } from "./score";

export interface Filters {
  query: string;
  category: CryptoCategory | "All";
  maxAttention: number;
  hideUnscored: boolean;
}

export const DEFAULT_FILTERS: Filters = { query: "", category: "All", maxAttention: 100, hideUnscored: false };

export function applyFilters(assets: CryptoAsset[], f: Filters): CryptoAsset[] {
  const q = f.query.trim().toLowerCase();
  return assets
    .filter((a) => f.category === "All" || a.category === f.category)
    .filter((a) => !q || [a.name, a.symbol, a.narrative].some((s) => s.toLowerCase().includes(q)))
    .filter((a) => a.attention === null || a.attention <= f.maxAttention)
    .filter((a) => !f.hideUnscored || researchSignal(a).score !== null)
    .sort((a, b) => (researchSignal(b).score ?? -1) - (researchSignal(a).score ?? -1));
}
