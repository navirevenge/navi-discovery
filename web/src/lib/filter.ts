import type { Asset, Category } from "../types";
import { computeSignal } from "./signal";

export interface Filters {
  query: string;
  category: Category | "all";
  maxAttention: number;
  minScore: number;
}
export const defaultFilters: Filters = { query: "", category: "all", maxAttention: 100, minScore: 0 };

export function applyFilters(assets: Asset[], f: Filters): Asset[] {
  const q = f.query.trim().toLowerCase();
  return assets
    .filter((a) => f.category === "all" || a.category === f.category)
    .filter((a) => !q || [a.symbol, a.name, a.narrative].some((s) => s.toLowerCase().includes(q)))
    .filter((a) => a.attention.value === null || a.attention.value <= f.maxAttention)
    .filter((a) => computeSignal(a).score >= f.minScore)
    .sort((x, y) => computeSignal(y).score - computeSignal(x).score);
}
