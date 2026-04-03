export const VALID_TICKERS = ['usdc', 'eth', 'usdt', 'eurc', 'wbtc', 'cbbtc'] as const;
export type ValidTicker = typeof VALID_TICKERS[number];
