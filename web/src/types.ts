export type Category = "L1" | "L2" | "DeFi" | "RWA/Stablecoin" | "AI/DePIN" | "Privacy/Infra" | "Memecoin/Launchpad";
export type DataStatus = "sample" | "verified";

/** Every metric carries provenance. Sample values are illustrative only. */
export interface Metric {
  value: number | null; // null = missing data
  status: DataStatus;
  source: string;
  sourceUrl?: string;
  observedAt: string; // when the fact was true
  retrievedAt: string; // when we fetched it
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: Category;
  narrative: string;
  summary: string;
  tvlGrowth90d: Metric; // % change in TVL / usage
  revenueGrowth90d: Metric; // % protocol revenue growth
  devActivity: Metric; // 0-100 normalised GitHub activity
  attention: Metric; // 0-100 attention/social index (higher = more crowded)
  fdvToRevenue: Metric; // valuation multiple
  unlock12mPct: Metric; // % of supply unlocking next 12m
  valueCapture: "direct" | "partial" | "unclear";
  catalysts: string[];
  risks: string[];
}

export interface Thesis {
  assetId: string;
  thesis: string;
  invalidation: string;
  milestones: { text: string; done: boolean }[];
  updatedAt: string;
}
