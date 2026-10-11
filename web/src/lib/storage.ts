import type { Thesis } from "../types";

const W = "navi.watchlist.v1";
const T = "navi.theses.v1";

function read<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : fallback; } catch { return fallback; }
}
export const loadWatchlist = (): string[] => read<string[]>(W, []);
export const saveWatchlist = (ids: string[]) => localStorage.setItem(W, JSON.stringify(ids));
export const loadTheses = (): Record<string, Thesis> => read<Record<string, Thesis>>(T, {});
export const saveTheses = (t: Record<string, Thesis>) => localStorage.setItem(T, JSON.stringify(t));
