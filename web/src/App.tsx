import { useEffect, useMemo, useState } from "react";
import { sampleAssets } from "./data/sample";
import { applyFilters, defaultFilters, type Filters } from "./lib/filter";
import { computeSignal } from "./lib/signal";
import { loadTheses, loadWatchlist, saveTheses, saveWatchlist } from "./lib/storage";
import type { Asset, Category, Thesis } from "./types";

const CATS: Category[] = ["L1", "L2", "DeFi", "RWA/Stablecoin", "AI/DePIN", "Privacy/Infra", "Memecoin/Launchpad"];
type Tab = "screener" | "watchlist" | "brief";

const fmt = (v: number | null, suffix = "") => (v === null ? "n/a" : `${v}${suffix}`);

function Card({ a, watched, onWatch, onOpen }: { a: Asset; watched: boolean; onWatch: () => void; onOpen: () => void }) {
  const s = computeSignal(a);
  return (
    <article className="card">
      <header>
        <button className="link" onClick={onOpen} aria-label={`Open research for ${a.name}`}>
          <strong>{a.symbol}</strong> <span className="muted">{a.name}</span>
        </button>
        <span className="score" title="Research priority, not a return forecast">{s.score}</span>
      </header>
      <p className="tags"><span className="tag">{a.category}</span><span className="tag alt">{a.narrative}</span><span className="tag warn">SAMPLE</span></p>
      <dl>
        <div><dt>TVL 90d</dt><dd>{fmt(a.tvlGrowth90d.value, "%")}</dd></div>
        <div><dt>Rev 90d</dt><dd>{fmt(a.revenueGrowth90d.value, "%")}</dd></div>
        <div><dt>Attention</dt><dd>{fmt(a.attention.value)}</dd></div>
        <div><dt>Unlock 12m</dt><dd>{fmt(a.unlock12mPct.value, "%")}</dd></div>
      </dl>
      <button className={watched ? "btn on" : "btn"} aria-pressed={watched} onClick={onWatch}>
        {watched ? "★ Watching" : "☆ Watch"}
      </button>
    </article>
  );
}

function Detail({ a, thesis, onSave, onClose }: { a: Asset; thesis?: Thesis; onSave: (t: Thesis) => void; onClose: () => void }) {
  const s = computeSignal(a);
  const [t, setT] = useState<Thesis>(thesis ?? { assetId: a.id, thesis: "", invalidation: "", milestones: [], updatedAt: "" });
  const [ms, setMs] = useState("");
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${a.name} research`}>
      <div className="sheet">
        <button className="btn close" onClick={onClose} aria-label="Close">✕</button>
        <h2>{a.symbol} <span className="muted">{a.name}</span></h2>
        <p>{a.summary}</p>
        <p className="notice">Sample data — illustrative only. Score = research priority, not a return forecast.</p>
        <h3>Signal {s.score}/100</h3>
        <ul>{s.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
        {s.missing.length > 0 && <p className="warnText">Missing data: {s.missing.join(", ")}</p>}
        <h3>Tokenholder value capture: {a.valueCapture}</h3>
        <p className="muted">Protocol success ≠ token value. Check fee flow, dilution and unlocks.</p>
        <h3>Catalysts</h3><ul>{a.catalysts.map((c) => <li key={c}>{c}</li>)}</ul>
        <h3>Risks</h3><ul>{a.risks.map((c) => <li key={c}>{c}</li>)}</ul>
        <h3>Evidence</h3>
        <p className="muted">{a.tvlGrowth90d.source} · observed {a.tvlGrowth90d.observedAt.slice(0, 10)} · retrieved {a.tvlGrowth90d.retrievedAt.slice(0, 10)} · status: {a.tvlGrowth90d.status}</p>
        <h3>My thesis</h3>
        <label>Thesis<textarea value={t.thesis} onChange={(e) => setT({ ...t, thesis: e.target.value })} /></label>
        <label>Invalidation conditions<textarea value={t.invalidation} onChange={(e) => setT({ ...t, invalidation: e.target.value })} /></label>
        <ul className="ms">{t.milestones.map((m, i) => (
          <li key={i}><label><input type="checkbox" checked={m.done} onChange={() => setT({ ...t, milestones: t.milestones.map((x, j) => j === i ? { ...x, done: !x.done } : x) })} /> {m.text}</label></li>
        ))}</ul>
        <div className="row">
          <input aria-label="New milestone" value={ms} placeholder="Add milestone" onChange={(e) => setMs(e.target.value)} />
          <button className="btn" onClick={() => { if (ms.trim()) { setT({ ...t, milestones: [...t.milestones, { text: ms.trim(), done: false }] }); setMs(""); } }}>Add</button>
        </div>
        <button className="btn primary" onClick={() => onSave({ ...t, updatedAt: new Date().toISOString() })}>Save thesis</button>
        {t.updatedAt && <p className="muted">Last saved {t.updatedAt.slice(0, 16).replace("T", " ")}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("screener");
  const [f, setF] = useState<Filters>(defaultFilters);
  const [watch, setWatch] = useState<string[]>(loadWatchlist);
  const [theses, setTheses] = useState<Record<string, Thesis>>(loadTheses);
  const [open, setOpen] = useState<Asset | null>(null);
  useEffect(() => saveWatchlist(watch), [watch]);
  useEffect(() => saveTheses(theses), [theses]);

  const list = useMemo(() => applyFilters(sampleAssets, f), [f]);
  const shown = tab === "watchlist" ? sampleAssets.filter((a) => watch.includes(a.id)) : list;
  const toggle = (id: string) => setWatch((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  return (
    <div className="app">
      <header className="top">
        <h1>NAVI<span>//</span>DISCOVERY</h1>
        <p className="banner" role="status">SAMPLE DATA — no live provider connected. Rankings are not findings.</p>
      </header>
      <main>
        {tab === "brief" ? (
          <section className="panel">
            <h2>Daily discovery brief</h2>
            <p>No live brief yet. Needs ingestion workers + provider access (see docs/DATA_PROVIDERS.md).</p>
            <p className="muted">Top sample research priorities (illustrative): {list.slice(0, 3).map((a) => a.symbol).join(", ")}</p>
          </section>
        ) : (
          <>
            {tab === "screener" && (
              <section className="filters" aria-label="Filters">
                <input type="search" aria-label="Search assets" placeholder="Search symbol, name, narrative" value={f.query} onChange={(e) => setF({ ...f, query: e.target.value })} />
                <div className="chips" role="group" aria-label="Category">
                  {(["all", ...CATS] as const).map((c) => (
                    <button key={c} className={f.category === c ? "chip on" : "chip"} aria-pressed={f.category === c} onClick={() => setF({ ...f, category: c })}>{c}</button>
                  ))}
                </div>
                <label>Max attention: {f.maxAttention}<input type="range" min={0} max={100} value={f.maxAttention} onChange={(e) => setF({ ...f, maxAttention: +e.target.value })} /></label>
                <label>Min score: {f.minScore}<input type="range" min={0} max={100} value={f.minScore} onChange={(e) => setF({ ...f, minScore: +e.target.value })} /></label>
              </section>
            )}
            <section className="grid" aria-label="Assets">
              {shown.length === 0 && <p className="muted">Nothing here yet.</p>}
              {shown.map((a) => <Card key={a.id} a={a} watched={watch.includes(a.id)} onWatch={() => toggle(a.id)} onOpen={() => setOpen(a)} />)}
            </section>
          </>
        )}
      </main>
      <nav className="tabs" aria-label="Primary">
        {(["screener", "watchlist", "brief"] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? "on" : ""} aria-current={tab === t ? "page" : undefined} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>
      {open && <Detail a={open} thesis={theses[open.id]} onClose={() => setOpen(null)} onSave={(t) => setTheses({ ...theses, [t.assetId]: t })} />}
    </div>
  );
}
