import type { Asset, Metric } from "../types";

// SAMPLE DATA: illustrative numbers for UI development. NOT live findings.
const NOW = "2025-01-01T00:00:00Z";
const m = (value: number | null, source = "Sample dataset"): Metric => ({
  value, status: "sample", source, observedAt: NOW, retrievedAt: NOW,
});

const a = (
  id: string, symbol: string, name: string, category: Asset["category"], narrative: string,
  summary: string, v: [number | null, number | null, number | null, number | null, number | null, number | null],
  valueCapture: Asset["valueCapture"], catalysts: string[], risks: string[],
): Asset => ({
  id, symbol, name, category, narrative, summary,
  tvlGrowth90d: m(v[0]), revenueGrowth90d: m(v[1]), devActivity: m(v[2]),
  attention: m(v[3]), fdvToRevenue: m(v[4]), unlock12mPct: m(v[5]),
  valueCapture, catalysts, risks,
});

export const sampleAssets: Asset[] = [
  a("eth", "ETH", "Ethereum", "L1", "Settlement layer", "Base settlement layer for L2s and DeFi.", [12, 8, 92, 70, 60, 1], "partial",
    ["L2 data-availability upgrades"], ["Fee capture shifting to L2s"]),
  a("sol", "SOL", "Solana", "L1", "High-throughput L1", "High-throughput L1 with consumer apps.", [30, 45, 88, 78, 40, 6], "direct",
    ["Client diversity milestones"], ["Outage history", "Inflation"]),
  a("arb", "ARB", "Arbitrum", "L2", "Ethereum scaling", "Optimistic rollup ecosystem.", [5, 10, 70, 35, 25, 18], "unclear",
    ["Governance fee-sharing proposals"], ["Token has limited fee claim", "Large unlocks"]),
  a("aave", "AAVE", "Aave", "DeFi", "On-chain credit", "Largest on-chain lending market.", [18, 28, 75, 40, 15, 2], "direct",
    ["Multi-chain deployments"], ["Oracle and liquidation risk"]),
  a("ena", "ENA", "Ethena", "RWA/Stablecoin", "Synthetic dollars", "Synthetic dollar protocol.", [40, 35, 55, 62, 22, 25], "partial",
    ["Fee switch activation"], ["Funding-rate dependence", "Dilution"]),
  a("ondo", "ONDO", "Ondo Finance", "RWA/Stablecoin", "Tokenized treasuries", "Tokenized treasury products.", [22, 15, 50, 45, 80, 30], "unclear",
    ["Institutional distribution"], ["Regulatory", "Token value capture unclear"]),
  a("tao", "TAO", "Bittensor", "AI/DePIN", "Decentralized AI", "Incentivized machine-learning subnets.", [null, null, 72, 80, null, 10], "unclear",
    ["Subnet economics"], ["Revenue data missing", "Speculative demand"]),
  a("render", "RENDER", "Render", "AI/DePIN", "GPU compute", "Distributed GPU rendering network.", [15, 20, 60, 55, 70, 5], "partial",
    ["Enterprise GPU demand"], ["Competition from cloud providers"]),
  a("zec", "ZEC", "Zcash", "Privacy/Infra", "Privacy", "Shielded-transaction L1.", [8, null, 45, 30, null, 0], "partial",
    ["Shielded supply growth"], ["Regulatory delisting risk"]),
  a("pump", "PUMP", "pump.fun", "Memecoin/Launchpad", "Launchpads", "Memecoin launchpad.", [55, 90, 30, 85, 12, 35], "unclear",
    ["Buyback programs"], ["Cyclical revenue", "Large unlocks"]),
];
