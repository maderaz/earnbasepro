/**
 * tooltipDefs — Central registry of tooltip definitions for all KV labels.
 */

export const KEY_DATA = {
  '24H APY': "Annualized yield based on the product's on-chain exchange rate over the past 24 hours.",
  '7D APY': 'Average annualized yield over the past 7 days.',
  '30D APY': 'Average annualized yield over the past 30 days.',
  TVL: 'Total value of deposits currently held in this product, in USD.',
  Network: 'The blockchain network this product is deployed on.',
  Platform: "The DeFi protocol providing the product's smart contract infrastructure.",
  Curator: 'The entity managing strategy selection and rebalancing for this product.',
  Asset: 'The token you deposit into and earn yield on.',
  'Vault Address': 'The on-chain smart contract address of the vault where funds are deposited.',
} as const;

// ── Market Benchmarking ───────────────────────────────────────

export const MARKET_BENCH = {
  'Asset Average APY': 'Mean 24h APY across all tracked strategies for this asset.',
  'This Product APY': 'Current 24-hour annualized yield for this specific product.',
  'Market Rank': "This product's position when all same-asset strategies are sorted by 24h APY.",
  'vs. Average': "How far this product's APY is above or below the asset-wide average, in percent.",
} as const;

// ── Network Positioning ───────────────────────────────────────

export const NETWORK_POS = {
  'Network Average': 'Mean 24h APY for this asset across all tracked strategies on this network.',
} as const;

// ── Yield Sustainability ──────────────────────────────────────

export const SUSTAINABILITY = {
  'Sustainability Score': 'Measures how stable current yields are relative to 30-day history. 100 = very stable, 10 = highly volatile.',
  Status: 'Classification of yield stability based on the sustainability score.',
} as const;

// ── Yield Trajectory ──────────────────────────────────────────

export const YIELD_TRAJECTORY = {
  'Current Streak': 'Number of consecutive days the APY has moved in the same direction.',
  'Days With Yield': 'Days in the tracking period where the product generated a positive return.',
  'vs. 30D Average': "How the current 24h APY compares to the product's own 30-day average.",
  'Week-over-Week': 'Change in average weekly APY compared to the previous 7-day period.',
} as const;

// ── Weekly Breakdown ──────────────────────────────────────────

export const WEEKLY_BREAKDOWN = {
  Period: 'The 7-day window being measured.',
  'Avg APY': 'Mean daily APY across this 7-day period.',
  'vs. Previous': 'Percentage change compared to the prior 7-day period.',
} as const;

// ── Historical APY Statistics ─────────────────────────────────

export const APY_STATS = {
  '30D Low': 'Lowest recorded 24h APY in the tracking period.',
  '30D High': 'Highest recorded 24h APY in the tracking period.',
  '30D Average': 'Mean of all daily APY values in the tracking period.',
  'Median APY': 'The middle value when all daily APYs are sorted. Less affected by outliers than average.',
  'Days Above Average': 'Number of days where APY exceeded the period average.',
  'Best Day': 'Single day with the highest recorded APY and the date it occurred.',
  'Worst Day': 'Single day with the lowest recorded APY and the date it occurred.',
  Volatility: 'Standard deviation of daily APY values. Low = consistent yields, High = large fluctuations.',
  Trend: 'Direction of yield movement, comparing recent performance to earlier in the period.',
  'Data Points': 'Total number of days with valid APY data used in these calculations.',
  'APY Range': 'Spread between the highest and lowest daily APY, in percentage points.',
  'Current Percentile': "This product's 30D average APY rank among all same-asset strategies. 99th = top 1%.",
} as const;

// ── Historical TVL Statistics ─────────────────────────────────

export const TVL_STATS = {
  '30D Low': 'Lowest recorded TVL in the tracking period.',
  '30D High': 'Highest recorded TVL in the tracking period.',
  '30D Average': 'Mean of all daily TVL values in the tracking period.',
  'Median TVL': 'The middle value when all daily TVLs are sorted. Less affected by outliers than average.',
  'Current TVL': 'Total value of deposits held in this product right now.',
  'Net Change': 'Total TVL percentage change from the start to end of the tracking period.',
  Trend: 'Direction of TVL movement, comparing recent levels to earlier in the period.',
  'TVL per APY Point': 'Amount of capital per 1% of APY. Higher = more capital trusts this product per unit of yield.',
  'Days of Inflows': 'Days where TVL increased compared to the previous day.',
  'Days of Outflows': 'Days where TVL decreased compared to the previous day.',
  'Largest Inflow': 'Biggest single-day TVL increase and the date it occurred.',
  'Largest Outflow': 'Biggest single-day TVL decrease and the date it occurred.',
} as const;

// ── Yield-TVL Dynamic ─────────────────────────────────────────

export const YIELD_TVL = {
  '30-Day Trend': 'Compares the directional movement of APY and TVL over the past 30 days.',
} as const;

// ── History Table ─────────────────────────────────────────────

export const HISTORY_TABLE = {
  '30-Day Summary': 'Aggregate stats for the full tracking period displayed in this table.',
} as const;

// ── Earnings Calculator ───────────────────────────────────────

export const EARNINGS = {
  Daily: 'Estimated daily earnings at the current on-chain APY, compounded annually.',
  Monthly: 'Estimated monthly earnings at the current on-chain APY, compounded annually.',
  Yearly: 'Estimated annual earnings at the current on-chain APY. This is a projection, not a guarantee.',
} as const;