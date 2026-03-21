/**
 * Legacy redirect map — old/crawled URLs → canonical equivalents.
 * Executed at module load in App.tsx, before React renders.
 *
 * Wave 1: 72 entries (original cleanup)
 * Wave 2: 76 entries (Google crawl logs from Figma CMS JSON paths)
 * Wave 3: 38 entries (GSC "Duplicate without user-selected canonical" report, Mar 2026)
 * Wave 4: 1 entry + 2 target corrections (Google-discovered old slug variants)
 * Total: 187 entries
 *
 * Future: consider in-app fuzzy matching for unknown /vault/ slugs
 * instead of growing this map indefinitely.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // ── Garbage URLs ──
  "/$": "/",
  "/&": "/",

  // ── Uppercase ticker hub pages ──
  "/ETH": "/eth",
  "/EURC": "/eurc",
  "/USDC": "/usdc",
  "/USDT": "/usdt",
  "/WBTC": "/wbtc",
  "/cbBTC": "/cbbtc",

  // ── Uppercase ticker/network pages ──
  "/ETH/Base": "/eth/base",
  "/ETH/Mainnet": "/eth/mainnet",
  "/EURC/Mainnet": "/eurc/mainnet",
  "/USDC/Arbitrum": "/usdc/arbitrum",
  "/USDC/Base": "/usdc/base",
  "/USDC/Mainnet": "/usdc/mainnet",
  "/USDT/Mainnet": "/usdt/mainnet",
  "/WBTC/Arbitrum": "/wbtc/arbitrum",
  "/cbBTC/Base": "/cbbtc/base",
  "/cbBTC/Mainnet": "/cbbtc/mainnet",

  // ── Invalid network slugs ──
  "/cbbtc/eth": "/cbbtc",
  "/eurc/eth": "/eurc",
  "/eurc/ethereum": "/eurc",
  "/usdc/eth": "/usdc",
  "/usdt/eth": "/usdt",
  "/usdt/ethereum": "/usdt",
  "/wbtc/eth": "/wbtc",
  "/EURC/Avalanche": "/eurc",

  // ── Old network slug ──
  "/usdc/bnb-chain": "/usdc/bnb",

  // ── Old format: /{ticker}/{network}/{product} → /vault/{new-slug} ──
  // Wave 1
  "/usdc/arbitrum/harvest-dolomite-autocompounder": "/vault/usdc-dolomite-autocompounder-harvest-arbitrum",
  "/usdc/arbitrum/morpho-ultrayield-usdc-(edge-capital)": "/vault/usdc-ultrayield-morpho-edge-capital-arbitrum",
  "/usdc/avalanche/euler-usdc---k3-capital-cluster": "/vault/usdc-cluster-euler-k3-capital-avalanche",
  "/usdc/avalanche/folks-finance-lending-market": "/vault/usdc-lending-market-folks-finance-avalanche",
  "/usdc/base/beefy-compound-v3-autocompounder": "/vault/usdc-compound-v3-autocompounder-beefy-base",
  "/usdc/base/harvest-arcadia-autocompounder": "/vault/usdc-arcadia-autocompounder-harvest-base",
  "/usdc/base/harvest-autopilot": "/vault/usdc-autopilot-harvest-base",
  "/usdc/base/morpho-high-yield-usdc-(clearstar)": "/vault/usdc-high-yield-morpho-clearstar-base",
  "/usdc/base/morpho-universal-usdc-(re7-labs)": "/vault/usdc-universal-morpho-re7-base",
  "/usdc/ethereum/maple-test-test-earn-maple": "/vault/usdc-earn-maple-mainnet",
  "/usdc/mainnet/euler-euler-prime-(eulerdao)": "/vault/usdc-euler-prime-eulerdao-mainnet",
  "/usdc/mainnet/euler-openeden-usdc-(ouroboros-capital)": "/vault/usdc-openeden-euler-ouroboros-capital-mainnet",
  "/usdc/mainnet/lagoon-autonomous-liquidity-usd-(almanak)": "/vault/usdc-autonomous-liquidity-usd-lagoon-almanak-mainnet",
  "/usdc/mainnet/morpho-blue-chip-usdc-vault-(sparkdao)": "/vault/usdc-blue-chip-vault-morpho-sparkdao-mainnet",
  "/usdc/mainnet/morpho-swissborg-usdc-(gauntlet)": "/vault/usdc-swissborg-morpho-gauntlet-mainnet",
  "/usdc/mainnet/morpho-tac-usdc-(9summits)": "/vault/usdc-core-morpho-9summits-mainnet",
  "/usdc/mainnet/morpho-vault-bridge-usdc-(steakhouse)": "/vault/usdc-vault-bridge-morpho-steakhouse-mainnet",
  "/usdc/mainnet/yearn-morpho-steakhouse-usdc-compounder": "/vault/usdc-morpho-steakhouse-compounder-yearn-mainnet",
  // Wave 2
  "/usdc/arbitrum/fluid-lend": "/vault/usdc-lend-fluid-arbitrum",
  "/usdc/arbitrum/morpho-usdc-reactor-(clearstar)": "/vault/usdc-reactor-morpho-clearstar-arbitrum",
  "/usdc/arbitrum/morpho-usdc-yield-(kpk)": "/vault/usdc-yield-morpho-kpk-arbitrum",
  "/usdc/avalanche/euler-usdc---re7-labs-cluster": "/vault/usdc-cluster-euler-re7-avalanche",
  "/usdc/base/avantis-earn---avusdc": "/vault/usdc-earn-avusdc-avantis-base",
  "/usdc/base/euler-euler-base": "/vault/usdc-euler-base",
  "/usdc/base/lagoon-core-usdc-(detrade)": "/vault/usdc-core-lagoon-detrade-base",
  "/usdc/base/morpho-prime-usdc-(gauntlet)": "/vault/usdc-prime-morpho-gauntlet-base",
  "/usdc/base/morpho-pyth-usdc-(re7-labs)": "/vault/usdc-pyth-morpho-re7-base",
  "/usdc/base/morpho-resolv-usdc-(apostro)": "/vault/usdc-resolv-morpho-apostro-base",
  "/usdc/base/morpho-seamless-usdc-(gauntlet)": "/vault/usdc-seamless-morpho-gauntlet-base",
  "/usdc/base/morpho-usdc-core-(gauntlet)": "/vault/usdc-core-morpho-gauntlet-base",
  "/usdc/base/morpho-usdc-vault-(apostro)": "/vault/usdc-vault-morpho-apostro-base",
  "/usdc/base/morpho-usdc-vault-(sparkdao)": "/vault/usdc-vault-morpho-sparkdao-base",
  "/usdc/base/morpho-yearn-og-usdc": "/vault/usdc-og-morpho-yearn-base",
  "/usdc/base/yearn-mopho-moonwell-flagship-usdc-compounder": "/vault/usdc-mopho-moonwell-flagship-compounder-yearn-base",
  "/usdc/mainnet/aave-v3": "/vault/usdc-v3-aave-mainnet",
  "/usdc/mainnet/euler-resolv-usdc-(tulipa)": "/vault/usdc-resolv-euler-tulipa-mainnet",
  "/usdc/mainnet/euler-swaap-lend": "/vault/usdc-swaap-lend-euler-mainnet",
  "/usdc/mainnet/fluid-lend": "/vault/usdc-lend-fluid-mainnet",
  "/usdc/mainnet/morpho-steakhouse-usdc-rwa": "/vault/usdc-rwa-morpho-steakhouse-mainnet",
  "/usdc/mainnet/morpho-usdc-prime-(kpk)": "/vault/usdc-prime-morpho-kpk-mainnet",
  "/usdc/mainnet/morpho-usdc-prime-(re7)": "/vault/usdc-prime-morpho-re7-mainnet",

  // ── Old vault slugs (missing network suffix or wrong word order) ──
  // Wave 1
  "/vault/cbbtc-cbbtc-market-radiant-v2": "/vault/cbbtc-market-radiant-v2-base",
  "/vault/eth-morpho-yearn-og-weth-compounder-yearn": "/vault/eth-morpho-yearn-og-weth-compounder-mainnet",
  "/vault/eth-weth-lend-fluid": "/vault/eth-weth-lend-fluid-mainnet",
  "/vault/eth-weth-lend-pool-arcadia": "/vault/eth-weth-lend-pool-arcadia-base",
  "/vault/eth-weth-spark": "/vault/eth-weth-spark-mainnet",
  "/vault/eth-wsteth-aave": "/vault/eth-wsteth-aave-mainnet",
  "/vault/eth-wsteth-spark": "/vault/eth-wsteth-spark-mainnet",
  "/vault/eurc-core-vault-yo": "/vault/eurc-core-vault-yo-base",
  "/vault/usdc-apostro-euler-apostro": "/vault/usdc-apostro-euler-bnb",
  "/vault/usdc-degen-usdc-morpho-yearn": "/vault/usdc-degen-morpho-yearn-arbitrum",
  "/vault/usdc-earn-avusdc-avantis": "/vault/usdc-earn-avusdc-avantis-base",
  "/vault/usdc-high-yield-usdc-morpho-steakhouse": "/vault/usdc-high-yield-morpho-steakhouse-base",
  "/vault/usdc-private-credit-wildcat-hyperithm": "/vault/usdc-private-credit-wildcat-hyperithm-mainnet",
  "/vault/usdc-srusd-leveraged-looping-ipor-fusion-reservoir": "/vault/usdc-srusd-ipor-fusion-reservoir-mainnet",
  "/vault/usdc-swissborg-usdc-morpho-gauntlet": "/vault/usdc-swissborg-morpho-gauntlet-mainnet",
  "/vault/usdc-universal-usdc-morpho-re7": "/vault/usdc-universal-morpho-re7-base",
  "/vault/usdc-usdc-autopilot-harvest": "/vault/usdc-autopilot-harvest-mainnet",
  "/vault/usdc-usdc-cluster-euler-k3-capital": "/vault/usdc-cluster-euler-k3-capital-avalanche",
  "/vault/usdc-usdc-morpho-mev-capital": "/vault/usdc-morpho-mev-capital-mainnet",
  "/vault/usdc-usdc-rwa-morpho-steakhouse": "/vault/usdc-rwa-morpho-steakhouse-mainnet",
  "/vault/usdc-usdc-vault-august-digital-morpho": "/vault/usdc-vault-morpho-august-digital-mainnet",
  "/vault/usdc-usdc-vault-morpho-hyperithm": "/vault/usdc-vault-morpho-hyperithm-arbitrum",
  "/vault/usdc-usdc-vault-morpho-pangolins": "/vault/usdc-vaults-morpho-pangolins-base",
  "/vault/usdt-flagship-usdt-morpho-b-protocol": "/vault/usdt-flagship-morpho-b-protocol-mainnet",
  "/vault/usdt-wintermute-trading-private-credit-wildcat": "/vault/usdt-wintermute-trading-private-credit-wildcat-mainnet",
  "/vault/wbtc-wbtc-market-spark": "/vault/wbtc-market-spark-mainnet",
  // Wave 2
  "/vault/cbbtc-usdc-market-aave": "/vault/cbbtc-usdc-market-aave-mainnet",
  "/vault/eth-cbeth-euler-base-euler-gauntlet": "/vault/eth-cbeth-euler-base-gauntlet",
  "/vault/eth-extrafi-autocompounder-harvest": "/vault/eth-extrafi-autocompounder-harvest-base",
  "/vault/eth-morpho-gauntlet-weth-prime-compounder-yearn-v2": "/vault/eth-morpho-gauntlet-weth-prime-compounder-yearn-v2-mainnet",
  "/vault/eth-seamless-weth-autocompounder-beefy": "/vault/eth-seamless-weth-autocompounder-beefy-base",
  "/vault/eth-weeth-euler-base-euler-gauntlet": "/vault/eth-weeth-euler-base-gauntlet",
  "/vault/eth-weth-core-vault-2-yearn-v2": "/vault/eth-weth-core-vault-2-yearn-v2-mainnet",
  "/vault/eth-weth-euler-prime-euler-gauntlet": "/vault/eth-weth-euler-prime-gauntlet-mainnet",
  "/vault/eth-weth-lending-fluid": "/vault/eth-weth-lending-fluid-base",
  "/vault/eth-wsteth-looping-ipor-fusion": "/vault/eth-wsteth-looping-ipor-fusion-base",
  "/vault/usdc-40-acres-autocompounder-harvest": "/vault/usdc-40-acres-autocompounder-harvest-base",
  "/vault/usdc-apostro-resolv-euler": "/vault/usdc-resolv-euler-apostro-mainnet",
  "/vault/usdc-autonomous-liquidity-usd-lagoon-almanak": "/vault/usdc-autonomous-liquidity-usd-lagoon-almanak-mainnet",
  "/vault/usdc-derivatives-pool-ipor-fusion": "/vault/usdc-derivatives-pool-ipor-fusion-mainnet",
  "/vault/usdc-euler-arbitrum-yield-euler-gauntlet": "/vault/usdc-euler-arbitrum-yield-gauntlet",
  "/vault/usdc-euler-prime-euler-eulerdao": "/vault/usdc-euler-prime-eulerdao-mainnet",
  "/vault/usdc-frontier-usdc-vault-mev-capital-morpho": "/vault/usdc-frontier-vault-morpho-mev-capital-base",
  "/vault/usdc-frontier-usdc-vault-morpho-mev-capital": "/vault/usdc-frontier-vault-morpho-mev-capital-base",
  "/vault/usdc-fusion-lending-optimizer-ipor-fusion": "/vault/usdc-fusion-lending-optimizer-ipor-base",
  "/vault/usdc-high-yield-usdc-clearstar-morpho": "/vault/usdc-high-yield-morpho-clearstar-base",
  "/vault/usdc-high-yield-usdc-v1-1-morpho-steakhouse": "/vault/usdc-high-yield-v1-1-morpho-steakhouse-base",
  "/vault/usdc-high-yield-usdc-v1-1-steakhouse-morpho": "/vault/usdc-high-yield-v1-1-morpho-steakhouse-base",
  "/vault/usdc-market-moonwell": "/vault/usdc-market-moonwell-base",
  "/vault/usdc-mopho-moonwell-flagship-usdc-compounder-yearn": "/vault/usdc-mopho-moonwell-flagship-compounder-yearn-base",
  "/vault/usdc-og-usdc-morpho-yearn": "/vault/usdc-og-morpho-yearn-mainnet",
  "/vault/usdc-pyth-usdc-morpho-re7": "/vault/usdc-pyth-morpho-re7-base",
  "/vault/usdc-reservoir-srusd-leveraged-looping-ipor": "/vault/usdc-srusd-ipor-fusion-reservoir-mainnet",
  "/vault/usdc-resolv-euler-apostro": "/vault/usdc-resolv-euler-apostro-mainnet",
  "/vault/usdc-resolv-usdc-apostro-euler": "/vault/usdc-resolv-euler-apostro-base",
  "/vault/usdc-resolv-usdc-morpho-gauntlet": "/vault/usdc-resolv-morpho-gauntlet-mainnet",
  "/vault/usdc-stablecoin-maxi-euler-re7": "/vault/usdc-stablecoin-maxi-euler-re7-mainnet",
  "/vault/usdc-turtle-avalanche-usdc-lagoon-9summits": "/vault/usdc-turtle-avalanche-lagoon-9summits",
  "/vault/usdc-turtle-usdc-morpho-9summits": "/vault/usdc-turtle-morpho-9summits-mainnet",
  "/vault/usdc-ultrayield-usdc-edge-capital-morpho": "/vault/usdc-ultrayield-morpho-edge-capital-mainnet",
  "/vault/usdc-usdc-frontier-morpho-gauntlet": "/vault/usdc-frontier-morpho-gauntlet-mainnet",
  "/vault/usdc-usdc-fusion-ipor": "/vault/usdc-ipor-fusion-mainnet",
  "/vault/usdc-usdc-ipor-fusion": "/vault/usdc-ipor-fusion-mainnet",
  "/vault/usdc-usdc-lending-optimizer-ipor-fusion-tesseract": "/vault/usdc-lending-optimizer-ipor-fusion-tesseract-mainnet",
  "/vault/usdc-usdc-prime-kpk-morpho": "/vault/usdc-prime-morpho-kpk-mainnet",
  "/vault/usdc-usdc-prime-morpho-kpk": "/vault/usdc-prime-morpho-kpk-mainnet",
  "/vault/usdc-usdc-reactor-morpho-clearstar": "/vault/usdc-reactor-morpho-clearstar-mainnet",
  "/vault/usdc-usdc-rwa-morpho-gauntlet": "/vault/usdc-rwa-morpho-gauntlet-mainnet",
  "/vault/usdc-usdc-vault-lagoon-excellion": "/vault/usdc-vault-lagoon-excellion-avalanche",
  "/vault/usdc-usdc-vault-morpho-apostro": "/vault/usdc-vault-morpho-apostro-base",
  "/vault/usdc-usdc-vault-morpho-sparkdao": "/vault/usdc-vault-morpho-sparkdao-base",
  "/vault/usdc-usdc-yield-morpho-kpk": "/vault/usdc-yield-morpho-kpk-arbitrum",
  "/vault/usdc-yousd-looper-ipor-fusion": "/vault/usdc-yousd-looper-ipor-fusion-ethereum",
  "/vault/usdt-deltausd-lagoon-smardex": "/vault/usdt-deltausd-lagoon-smardex-mainnet",
  "/vault/wbtc-pendle-wbtc-morpho-mev-capital": "/vault/wbtc-pendle-morpho-mev-capital-mainnet",
  "/vault/wbtc-reservoir-btc-yield-leveraged-looping-ipor-fusion": "/vault/wbtc-btc-yield-ipor-fusion-reservoir-mainnet",
  "/vault/wbtc-wbtc-pool-across-protocol": "/vault/wbtc-pool-across-protocol-mainnet",

  // Wave 3 — GSC "Duplicate without user-selected canonical" report (Mar 2026)
  // Duplicate ticker in slug, missing network suffix, or wrong word order
  "/vault/cbbtc-cbbtc-core-morpho-gauntlet": "/vault/cbbtc-core-morpho-gauntlet-base",
  "/vault/cbbtc-cbbtc-market-extrafi": "/vault/cbbtc-market-extrafi-base",
  "/vault/cbbtc-flagship-cbbtc-lagoon-tulipa-capital": "/vault/cbbtc-flagship-lagoon-tulipa-capital-mainnet",
  "/vault/eth-infinifi-eth-carry-ipor-fusion": "/vault/eth-infinifi-carry-ipor-fusion-ethereum",
  "/vault/eth-staking-product-meth-protocol": "/vault/eth-staking-product-meth-protocol-mainnet",
  "/vault/usdc-blue-chip-usdc-vault-morpho-sparkdao": "/vault/usdc-blue-chip-vault-morpho-sparkdao-mainnet",
  "/vault/usdc-cap-ecosystem-usdc-morpho-gauntlet": "/vault/usdc-cap-ecosystem-morpho-gauntlet-mainnet",
  "/vault/usdc-compound-autocompounder-beefy": "/vault/usdc-compound-autocompounder-beefy-arbitrum",
  "/vault/usdc-cronos-usdc-ecosystem-morpho-steakhouse": "/vault/usdc-cronos-ecosystem-morpho-steakhouse-mainnet",
  "/vault/usdc-elixir-usdc-morpho-mev-capital": "/vault/usdc-elixir-morpho-mev-capital-mainnet",
  "/vault/usdc-euler-yield-euler-eulerdao": "/vault/usdc-euler-yield-eulerdao-mainnet",
  "/vault/usdc-extrafi-xlend-usdc-morpho-gauntlet": "/vault/usdc-extrafi-xlend-morpho-gauntlet-base",
  "/vault/usdc-f-protocol-morpho-re7-mainnet": "/vault/usdc-f-x-protocol-morpho-re7-mainnet",
  "/vault/usdc-fx-protocol-morpho-re7": "/vault/usdc-f-x-protocol-morpho-re7-mainnet",
  "/vault/usdc-gauntlet-usdc-frontier-morpho": "/vault/usdc-frontier-morpho-gauntlet-mainnet",
  "/vault/usdc-high-yield-usdc-morpho-clearstar": "/vault/usdc-high-yield-morpho-clearstar-base",
  "/vault/usdc-infinifi-usdc-morpho-steakhouse": "/vault/usdc-infinifi-morpho-steakhouse-mainnet",
  "/vault/usdc-labs-cluster-euler-re7": "/vault/usdc-cluster-euler-re7-avalanche",
  "/vault/usdc-moonwell-autocompounder-harvest": "/vault/usdc-moonwell-autocompounder-harvest-base",
  "/vault/usdc-moonwell-flagship-b-protocol-morpho": "/vault/usdc-moonwell-flagship-morpho-b-protocol-base",
  "/vault/usdc-moonwell-flagship-morpho-b-protocol": "/vault/usdc-moonwell-flagship-morpho-b-protocol-base",
  "/vault/usdc-prime-usdc-morpho-gauntlet": "/vault/usdc-prime-morpho-gauntlet-mainnet",
  "/vault/usdc-resolv-usdc-euler-apostro": "/vault/usdc-resolv-euler-apostro-base",
  "/vault/usdc-resolv-usdc-morpho-apostro": "/vault/usdc-resolv-morpho-apostro-base",
  "/vault/usdc-seamless-usdc-morpho-gauntlet": "/vault/usdc-seamless-morpho-gauntlet-base",
  "/vault/usdc-tulipa-euler-tulipa": "/vault/usdc-tulipa-euler-bnb",
  "/vault/usdc-turtle-avalanche-usdc-9summits-lagoon": "/vault/usdc-turtle-avalanche-lagoon-9summits",
  "/vault/usdc-ultrayield-usdc-morpho-edge-capital": "/vault/usdc-ultrayield-morpho-edge-capital-mainnet",
  "/vault/usdc-usdc-cluster-euler-re7": "/vault/usdc-cluster-euler-re7-avalanche",
  "/vault/usdc-usdc-degen-morpho-hyperithm": "/vault/usdc-degen-morpho-hyperithm-arbitrum",
  "/vault/usdc-usdc-morpho-steakhouse": "/vault/usdc-morpho-steakhouse-mainnet",
  "/vault/usdc-usdc-prime-morpho-gauntlet": "/vault/usdc-prime-morpho-gauntlet-mainnet",
  "/vault/usdc-usdc-vault-lagoon-syntropia": "/vault/usdc-vault-lagoon-syntropia-mainnet",
  "/vault/usdc-usdc-vault-morpho-august-digital": "/vault/usdc-vault-morpho-august-digital-mainnet",
  "/vault/usdc-usdc-vault-morpho-re7": "/vault/usdc-vault-morpho-re7-mainnet",
  "/vault/usdc-vault-bridge-usdc-morpho-steakhouse": "/vault/usdc-vault-bridge-morpho-steakhouse-mainnet",
  "/vault/usdc-wintermute-trading-private-credit-wildcat": "/vault/usdc-wintermute-trading-private-credit-wildcat-mainnet",
  "/vault/usdt-v3-aave": "/vault/usdt-v3-aave-mainnet",
  // NOTE: wbtc-core-morpho-gauntlet-mainnet and wbtc-lending-fluid-mainnet
  // appear in GSC as duplicates but may already be canonical slugs.
  // Verify against live data before adding redirects for these.

  // ── Dead products → hub page ──
  "/vault/cbbtc-wintermute-trading-wildcat-mainnet": "/cbbtc",
  "/vault/usdt-clearstar-boring-morpho-ethereum": "/usdt",

  // ── Wave 4 — Google-discovered old slug variants ──
  "/vault/usdc-core-usdc-lagoon-detrade": "/vault/usdc-core-lagoon-detrade-base",
};

/**
 * Module-level side effect: check for redirect IMMEDIATELY when this module
 * is first imported — before any React component can render.
 * `window.location.replace()` is async (browser still executes JS after the call),
 * so we also set a flag to let App.tsx short-circuit rendering to prevent flash.
 */
export let isRedirecting = false;

(() => {
  const target = LEGACY_REDIRECTS[window.location.pathname];
  if (target) {
    isRedirecting = true;
    window.location.replace(target);
  }
})();