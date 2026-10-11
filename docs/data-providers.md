# Data provider requirements

Every evidence item must carry: source URL, observation date, retrieval timestamp, and provenance (`verified` | `inferred` | `sample`). Missing values stay `null`; never estimate.

| Provider | Use | Access | Status |
|---|---|---|---|
| DeFiLlama | TVL, fees, revenue, stablecoins, unlocks | Public API (free tier; Pro key for some endpoints) | Not integrated |
| GitHub API | Dev activity | Token (`GITHUB_TOKEN`) for rate limits | Not integrated |
| Governance forums / protocol blogs | Catalysts, proposals | RSS/HTML, per-site terms | Not integrated |
| SEC EDGAR | Filings, fundamentals | Free; requires declared User-Agent, 10 req/s limit | Not integrated |
| FDA announcements | Biotech catalysts | Public feeds | Not integrated |
| Price/market cap (e.g. CoinGecko) | Valuation, attention proxies | Key; paid for commercial/history | Needs decision |
| Dune, Token Terminal, X | Deeper onchain/fundamental/social | Paid; add when cost justified | Deferred |

Keys go in environment variables / secret store only.
