# NAVI Discovery

Mobile-friendly investment research platform for finding stocks, crypto protocols and emerging industries early (6–36 month horizon). Scores indicate **research priority, not expected returns.**

## Status (Milestone 1)

| Area | State |
|---|---|
| Crypto screener (filters: search, category, max attention, data sufficiency) | Works |
| Explainable research signal with missing-data list | Works (heuristic, unvalidated) |
| Responsive dashboard, touch-sized controls, mobile nav | Works |
| Watchlist, thesis, invalidation, milestones | Works (browser localStorage only) |
| Data | **Sample only** – 8 assets with illustrative placeholder metrics, labeled everywhere |
| DeFiLlama / GitHub / SEC / FDA ingestion | Not built; see [docs/data-providers.md](docs/data-providers.md) |
| Stocks, narrative timelines, daily brief, attention analysis | Not built |
| Spring Boot + PostgreSQL/pgvector + Python workers | Not built; see [docs/architecture.md](docs/architecture.md) |

No predictive effectiveness is claimed. Signals must be backtested on point-in-time data including failed and delisted assets first.

## Setup

```bash
cd web
npm ci
npm run dev     # http://localhost:5173
npm test
npm run build
```

Requires Node 22. No secrets are needed yet; never commit `.env` files (git-ignored).
