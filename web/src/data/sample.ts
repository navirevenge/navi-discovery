import type { CryptoAsset } from "../lib/types";

/**
 * SAMPLE DATA ONLY. Asset names are real, but every metric below is an
 * illustrative placeholder, NOT a live or verified figure. Replace via the
 * ingestion worker (see docs/data-providers.md).
 */
const SAMPLE_DATE = "2025-01-01";
const sample = (label: string) => ({
  label,
  provenance: "sample" as const,
  sourceUrl: null,
  observedOn: SAMPLE_DATE,
  retrievedAt: null,
});

export const SAMPLE_ASSETS: CryptoAsset[] = [
  {
    id: "eth", symbol: "ETH", name: "Ethereum", category: "L1/L2",
    narrative: "Rollup-centric settlement", stage: "Institutional recognition",
    tvlGrowth90dPct: 12, activeUsersGrowth90dPct: 8, feesGrowth90dPct: 5,
    valueCapture: "buyback", unlock12mPct: 0, fdvToFees: 120, attention: 90,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Fee capture shifting to L2s"], catalysts: ["Blob capacity increases"],
  },
  {
    id: "sol", symbol: "SOL", name: "Solana", category: "L1/L2",
    narrative: "High-throughput consumer apps", stage: "Fundamental acceleration",
    tvlGrowth90dPct: 35, activeUsersGrowth90dPct: 20, feesGrowth90dPct: 40,
    valueCapture: "buyback", unlock12mPct: 6, fdvToFees: 60, attention: 80,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Network reliability history", "Validator concentration"], catalysts: ["Client diversity milestones"],
  },
  {
    id: "aave", symbol: "AAVE", name: "Aave", category: "DeFi",
    narrative: "On-chain credit markets", stage: "Fundamental acceleration",
    tvlGrowth90dPct: 25, activeUsersGrowth90dPct: 15, feesGrowth90dPct: 30,
    valueCapture: "buyback", unlock12mPct: 2, fdvToFees: 25, attention: 45,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Smart-contract risk", "Regulatory uncertainty"], catalysts: ["New market deployments"],
  },
  {
    id: "ondo", symbol: "ONDO", name: "Ondo Finance", category: "RWA/Stablecoins",
    narrative: "Tokenized treasuries", stage: "Early adoption",
    tvlGrowth90dPct: 60, activeUsersGrowth90dPct: 25, feesGrowth90dPct: null,
    valueCapture: "governance-only", unlock12mPct: 30, fdvToFees: null, attention: 40,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Token unlocks", "Protocol success may not accrue to token"], catalysts: ["Institutional product launches"],
  },
  {
    id: "render", symbol: "RNDR", name: "Render", category: "AI/DePIN",
    narrative: "Decentralized GPU compute", stage: "Early adoption",
    tvlGrowth90dPct: null, activeUsersGrowth90dPct: 18, feesGrowth90dPct: 22,
    valueCapture: "buyback", unlock12mPct: 4, fdvToFees: 150, attention: 55,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Competition from centralized GPU clouds"], catalysts: ["Enterprise rendering contracts"],
  },
  {
    id: "mkr", symbol: "MKR", name: "Maker / Sky", category: "RWA/Stablecoins",
    narrative: "Stablecoin yield via RWAs", stage: "Institutional recognition",
    tvlGrowth90dPct: 10, activeUsersGrowth90dPct: 5, feesGrowth90dPct: 12,
    valueCapture: "buyback", unlock12mPct: 0, fdvToFees: 15, attention: 35,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Collateral concentration", "Governance complexity"], catalysts: ["Savings-rate adoption"],
  },
  {
    id: "zec", symbol: "ZEC", name: "Zcash", category: "Privacy/Infra",
    narrative: "Optional shielded transactions", stage: "Emergence",
    tvlGrowth90dPct: null, activeUsersGrowth90dPct: 10, feesGrowth90dPct: null,
    valueCapture: "none", unlock12mPct: 0, fdvToFees: null, attention: 25,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Regulatory delisting pressure"], catalysts: ["Wallet usability upgrades"],
  },
  {
    id: "pump", symbol: "PUMP", name: "Pump.fun", category: "Memecoins/Launchpads",
    narrative: "Token launch platforms", stage: "Mainstream attention",
    tvlGrowth90dPct: null, activeUsersGrowth90dPct: -10, feesGrowth90dPct: -20,
    valueCapture: "buyback", unlock12mPct: 40, fdvToFees: 30, attention: 85,
    dataAsOf: SAMPLE_DATE, evidence: [sample("Illustrative growth metrics")],
    risks: ["Cyclical activity", "Large unlocks", "Regulatory exposure"], catalysts: [],
  },
];
