# Architecture & requirements traceability

> **Living document: every PR must update it** (see "Change log" and the PR template).

## 1. Business goal
Find stocks, crypto protocols and emerging industries before they become popular, on a 6–36 month horizon. Central question: *what is happening today that could make an asset more valuable over the next few years?* Scores are research priority, never return forecasts.

## 2. Current architecture (Milestone 1)
```
Browser ── React + TypeScript (Vite, web/) ──┬─ src/data/sample.ts   (SAMPLE data, provenance on every metric)
                                              ├─ src/lib/signal.ts    (explainable research-priority score)
                                              ├─ src/lib/filter.ts    (screener filters + ranking)
                                              └─ src/lib/storage.ts   (watchlist/thesis in localStorage)
CI: .github/workflows/ci.yml (build+test)   Deploy: .github/workflows/pages.yml (GitHub Pages)
```
Static front end only: no server, no secrets, no live data.

## 3. Target architecture (not built yet)
Python ingestion workers (scheduled daily) → PostgreSQL/pgvector (point-in-time snapshots) → Spring Boot API → React. Kafka only when streaming requirements justify it. Needs a host running a JVM, Postgres and a scheduler; to be agreed before the switch.

## 4. Requirement → implementation traceability
| Business requirement | Implementation | Status |
|---|---|---|
| Opportunity screener (filters by type, narrative, growth, valuation, freshness) | `App.tsx` filters, `lib/filter.ts` | Partial: crypto only; category, search, attention, score filters; no freshness filter; 10 sample assets (target 50–100) |
| Explainable signals with evidence and missing data | `lib/signal.ts` returns score, reasons, missing; missing inputs never imputed, sparse data penalised; `lib/signal.test.ts` | Works on sample data |
| Narrative timelines | — | Not started |
| Asset research pages (fundamentals, catalysts, risks, sources; value capture vs protocol success, unlocks) | `Detail` in `App.tsx`; `valueCapture`, `unlock12mPct` fields | Partial; sources are sample placeholders |
| Watchlists and thesis tracking (thesis, invalidation, milestones) | `App.tsx`, `lib/storage.ts` | Works, per-browser only |
| Daily discovery brief | Placeholder tab | Needs ingestion |
| Provenance: source links, observed/retrieved dates, verified vs inferred vs sample | `types.ts` `Metric` (`status`, `source`, `observedAt`, `retrievedAt`); SAMPLE banner and tags in UI | Model done; `inferred` status not yet in the type |
| Never present sample data as live | Persistent banner, SAMPLE tags, tested in `signal.test.ts`, `App.test.tsx` | Works |
| Mobile + desktop, accessible | Responsive CSS, bottom nav, 44px targets, ARIA labels, focus styles | Works; no automated a11y audit |
| Cyberpunk NAVI design | `styles.css` | Works |
| Secrets out of git | `.gitignore`; no secrets needed yet | OK |
| Tests, CI, docs, provider requirements | Vitest, CI workflow, README, `DATA_PROVIDERS.md` | Works |
| Web access | Pages workflow | Deploys after merge to `main` |
| Validate signals on point-in-time data incl. failed/delisted assets before claiming prediction | — | Not started; no predictive claims made |

## 5. Key decisions
- Static app first: reversible, free hosting, no secrets.
- Score weights are heuristic and unvalidated; they live in one file for easy change.
- localStorage for notes until a backend with accounts exists.

## 6. Change log
| PR | Change | Requirements affected |
|---|---|---|
| Milestone 1 | Dashboard, screener, signals, watchlist, thesis | Screener, signals, research page, watchlist, design |
| Pages deploy | GitHub Pages workflow | Web access |
| Architecture doc | This document and PR template | Process |
