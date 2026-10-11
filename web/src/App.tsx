import { useEffect, useState } from "react";
import { SAMPLE_ASSETS } from "./data/sample";
import { applyFilters, DEFAULT_FILTERS, type Filters } from "./lib/filter";
import { researchSignal } from "./lib/score";
import { load, save, type Saved } from "./lib/storage";
import type { CryptoAsset, CryptoCategory } from "./lib/types";

const CATEGORIES: (CryptoCategory | "All")[] = [
  "All", "L1/L2", "DeFi", "RWA/Stablecoins", "AI/DePIN", "Privacy/Infra", "Memecoins/Launchpads",
];
type Tab = "screener" | "watchlist";

export function App() {
  const [tab, setTab] = useState<Tab>("screener");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [saved, setSaved] = useState<Saved>(() => load());
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => save(saved), [saved]);

  const toggleWatch = (id: string) =>
    setSaved((s) => ({
      ...s,
      watchlist: s.watchlist.includes(id) ? s.watchlist.filter((x) => x !== id) : [...s.watchlist, id],
    }));

  const visible =
    tab === "screener" ? applyFilters(SAMPLE_ASSETS, filters) : SAMPLE_ASSETS.filter((a) => saved.watchlist.includes(a.id));
  const open = SAMPLE_ASSETS.find((a) => a.id === openId) ?? null;

  return (
    <div className="shell">
      <header className="top">
        <h1>NAVI <span>Discovery</span></h1>
        <nav aria-label="Main" className="nav">
          {(["screener", "watchlist"] as Tab[]).map((t) => (
            <button key={t} aria-current={tab === t ? "page" : undefined} onClick={() => setTab(t)}>
              {t === "screener" ? "Screener" : `Watchlist (${saved.watchlist.length})`}
            </button>
          ))}
        </nav>
      </header>
      <div role="status" className="banner">
        SAMPLE DATA — illustrative placeholders, not live findings. Scores indicate research priority, not expected returns.
      </div>
      <main>
        {tab === "screener" && (
          <section className="filters" aria-label="Filters">
            <label>Search
              <input type="search" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} />
            </label>
            <label>Category
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as Filters["category"] })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Max attention: {filters.maxAttention}
              <input type="range" min={0} max={100} value={filters.maxAttention}
                onChange={(e) => setFilters({ ...filters, maxAttention: Number(e.target.value) })} />
            </label>
            <label className="check">
              <input type="checkbox" checked={filters.hideUnscored} onChange={(e) => setFilters({ ...filters, hideUnscored: e.target.checked })} />
              Hide assets with insufficient data
            </label>
          </section>
        )}
        {visible.length === 0 && <p className="empty">{tab === "watchlist" ? "No saved assets yet." : "No assets match."}</p>}
        <ul className="cards">
          {visible.map((a) => (
            <AssetCard key={a.id} a={a} watched={saved.watchlist.includes(a.id)}
              onWatch={() => toggleWatch(a.id)} onOpen={() => setOpenId(a.id)} />
          ))}
        </ul>
        {open && (
          <ResearchPanel a={open} saved={saved} setSaved={setSaved} onClose={() => setOpenId(null)} />
        )}
      </main>
    </div>
  );
}

function AssetCard({ a, watched, onWatch, onOpen }: { a: CryptoAsset; watched: boolean; onWatch: () => void; onOpen: () => void }) {
  const sig = researchSignal(a);
  return (
    <li className="card">
      <div className="row">
        <div>
          <h2>{a.name} <small>{a.symbol}</small></h2>
          <p className="muted">{a.category} · {a.narrative}</p>
        </div>
        <div className="score" aria-label={sig.score === null ? "Not scored" : `Research priority ${sig.score} of 100`}>
          {sig.score ?? "n/a"}
        </div>
      </div>
      <p className="muted">Stage: {a.stage} · <span className="tag">sample</span></p>
      {sig.missing.length > 0 && <p className="missing">Missing: {sig.missing.join(", ")}</p>}
      <div className="row actions">
        <button onClick={onOpen}>Research</button>
        <button aria-pressed={watched} onClick={onWatch}>{watched ? "★ Saved" : "☆ Save"}</button>
      </div>
    </li>
  );
}

function ResearchPanel({ a, saved, setSaved, onClose }: { a: CryptoAsset; saved: Saved; setSaved: (f: (s: Saved) => Saved) => void; onClose: () => void }) {
  const sig = researchSignal(a);
  const t = saved.theses[a.id];
  const [thesis, setThesis] = useState(t?.thesis ?? "");
  const [invalidation, setInvalidation] = useState(t?.invalidation ?? "");
  const [milestone, setMilestone] = useState("");
  const milestones = t?.milestones ?? [];

  const persist = (m = milestones) =>
    setSaved((s) => ({
      ...s,
      theses: { ...s.theses, [a.id]: { assetId: a.id, thesis, invalidation, milestones: m, updatedAt: new Date().toISOString() } },
    }));

  return (
    <aside className="panel" role="dialog" aria-label={`${a.name} research`}>
      <button className="close" onClick={onClose}>Close</button>
      <h2>{a.name} ({a.symbol})</h2>
      <h3>Why it's flagged</h3>
      <ul>{sig.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
      <h3>Tokenholder value capture</h3>
      <p>Value capture: {a.valueCapture ?? "unknown"} · 12m unlocks: {a.unlock12mPct ?? "unknown"}% · FDV/fees: {a.fdvToFees ?? "unknown"}</p>
      <h3>Risks</h3><ul>{a.risks.map((r) => <li key={r}>{r}</li>)}</ul>
      <h3>Catalysts</h3>
      <ul>{a.catalysts.length ? a.catalysts.map((r) => <li key={r}>{r}</li>) : <li>None recorded</li>}</ul>
      <h3>Evidence</h3>
      <ul>{a.evidence.map((e) => (
        <li key={e.label}>{e.label} — <b>{e.provenance}</b>, observed {e.observedOn}, {e.retrievedAt ? `retrieved ${e.retrievedAt}` : "never retrieved"}
          {e.sourceUrl ? <> · <a href={e.sourceUrl}>source</a></> : " · no source"}</li>
      ))}</ul>
      <h3>My thesis</h3>
      <label>Thesis<textarea value={thesis} onChange={(e) => setThesis(e.target.value)} onBlur={() => persist()} /></label>
      <label>Invalidation conditions<textarea value={invalidation} onChange={(e) => setInvalidation(e.target.value)} onBlur={() => persist()} /></label>
      <ul className="miles">{milestones.map((m, i) => (
        <li key={i}><label className="check"><input type="checkbox" checked={m.done}
          onChange={() => persist(milestones.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />{m.text}</label></li>
      ))}</ul>
      <form onSubmit={(e) => { e.preventDefault(); if (milestone.trim()) { persist([...milestones, { text: milestone.trim(), done: false }]); setMilestone(""); } }}>
        <label>New milestone<input value={milestone} onChange={(e) => setMilestone(e.target.value)} /></label>
        <button type="submit">Add milestone</button>
      </form>
      {t && <p className="muted">Last updated {t.updatedAt}</p>}
    </aside>
  );
}
