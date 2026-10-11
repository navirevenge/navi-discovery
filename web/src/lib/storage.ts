import type { ThesisEntry } from "./types";

const KEY = "navi.v1";
export interface Saved { watchlist: string[]; theses: Record<string, ThesisEntry> }

export function load(storage: Storage = localStorage): Saved {
  try {
    const raw = JSON.parse(storage.getItem(KEY) ?? "null");
    if (raw && Array.isArray(raw.watchlist) && raw.theses && typeof raw.theses === "object") return raw;
  } catch { /* corrupted: fall through */ }
  return { watchlist: [], theses: {} };
}

export function save(s: Saved, storage: Storage = localStorage) {
  storage.setItem(KEY, JSON.stringify(s));
}
