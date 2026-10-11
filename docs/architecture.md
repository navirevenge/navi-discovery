# Architecture and decisions

- **Now:** static React (Vite, TypeScript) app; state in localStorage. Deploys to any static host (GitHub Pages, Netlify, Cloudflare Pages).
- **Next:** Python daily ingestion worker (scheduled via GitHub Actions cron) writing JSON snapshots with point-in-time history; frontend reads snapshots. Cheap, no server.
- **Later:** Spring Boot API + PostgreSQL/pgvector once multi-device watchlists/accounts or semantic search are needed. This requires a host for the API and a managed Postgres (not available on static hosts) — a cost decision to make before adoption.
- **Kafka:** deferred until streaming requirements exist; daily batch doesn't need it.
- **Validation:** store snapshots append-only (including delisted/failed assets) so signals can be backtested point-in-time.
