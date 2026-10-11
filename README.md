# NAVI Discovery

Mobile-friendly research platform for finding long-term (6–36 month) stock and crypto candidates early. Scores are **research priority, not return forecasts**.

## Status (Milestone 1)
| Works | Sample data | Needs provider access |
|---|---|---|
| Cyberpunk responsive dashboard, crypto screener with filters, explainable signals with missing-data list, asset research modal, watchlist + thesis/invalidation/milestones (browser localStorage), CI, tests | All 10 assets and metrics are **illustrative sample data**, labelled in the UI | Live DeFiLlama / GitHub / filings ingestion, daily brief, stocks, narrative timelines |

## Run
```
cd web
npm ci
npm run dev     # dev server
npm test        # unit/UI tests
npm run build
```

## Architecture & decisions
- Now: static React + TypeScript (Vite) app; persistence in localStorage (reversible, no hosting needed).
- Next: Python daily ingestion workers → PostgreSQL/pgvector → Spring Boot API. Needs a host that runs a JVM + Postgres and a scheduler (e.g. cron/GitHub Actions); Kafka only when streaming is justified.
- Roadmap: public-company fundamentals → cross-sector narrative mapping → attention analysis → point-in-time signal evaluation.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (required update with every PR) and [docs/DATA_PROVIDERS.md](docs/DATA_PROVIDERS.md). Never commit secrets.

## Live site
Pushes to `main` deploy to GitHub Pages via `.github/workflows/pages.yml`:
https://navirevenge.github.io/navi-discovery/
(If the first deploy fails, enable Settings → Pages → Source: GitHub Actions.)
