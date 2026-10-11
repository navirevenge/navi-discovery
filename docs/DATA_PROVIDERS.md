# Data provider requirements

| Source | Use | Access / cost | Status |
|---|---|---|---|
| DeFiLlama | TVL, fees, revenue, stablecoins | Public API (free tier); rate limits apply | Not connected |
| GitHub API | Developer activity | Token (env `GITHUB_TOKEN`), free | Not connected |
| Governance forums / protocol blogs | Catalysts, tokenomics | RSS / scraping, respect ToS | Not connected |
| SEC EDGAR | Filings (stocks, milestone 2) | Free; requires User-Agent | Planned |
| FDA announcements | Biotech catalysts | Public feeds | Planned |
| Dune / Token Terminal | Deeper on-chain/financials | Paid; add if justified | Optional |
| X sources | Attention | Paid API | Optional |

Every ingested value must store: `source`, `sourceUrl`, `observedAt`, `retrievedAt`, and `status` (`verified` | `inferred` | `sample`). Missing values stay `null`; never impute. Secrets go in environment variables, never in git.

## Signal validation
Before claiming predictive value, backtest on point-in-time snapshots including failed and delisted assets (avoid survivorship bias).
