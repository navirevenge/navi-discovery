export type Provenance = "verified" | "inferred" | "sample";

export interface Evidence {
  label: string;
  provenance: Provenance;
  /** Source URL; null for sample data. */
  sourceUrl: string | null;
  /** Date the observation refers to (ISO date). */
  observedOn: string;
  /** When NAVI retrieved it (ISO timestamp); null if never retrieved. */
  retrievedAt: string | null;
}

export type CryptoCategory =
  | "L1/L2"
  | "DeFi"
  | "RWA/Stablecoins"
  | "AI/DePIN"
  | "Privacy/Infra"
  | "Memecoins/Launchpads";

export type Stage =
  | "Emergence"
  | "Early adoption"
  | "Fundamental acceleration"
  | "Institutional recognition"
  | "Mainstream attention";

/** Any metric may be null = missing data. Never fill with guesses. */
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  category: CryptoCategory;
  narrative: string;
  stage: Stage;
  /** Protocol-level success */
  tvlGrowth90dPct: number | null;
  activeUsersGrowth90dPct: number | null;
  feesGrowth90dPct: number | null;
  /** Tokenholder value capture */
  valueCapture: "fees-to-holders" | "buyback" | "governance-only" | "none" | null;
  /** Share of supply still locked / to unlock within 12 months (%) */
  unlock12mPct: number | null;
  /** Fully diluted valuation / annualized fees */
  fdvToFees: number | null;
  /** Attention proxy 0-100 (higher = more crowded) */
  attention: number | null;
  dataAsOf: string;
  evidence: Evidence[];
  risks: string[];
  catalysts: string[];
}

export interface ThesisEntry {
  assetId: string;
  thesis: string;
  invalidation: string;
  milestones: { text: string; done: boolean }[];
  updatedAt: string;
}
