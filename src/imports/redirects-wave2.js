# Additional Redirects — Wave 2

## Instruction for Figma AI

Google's crawler discovered 76 more old URLs through Figma's internal JSON/CMS paths. These need to be added to the existing LEGACY_REDIRECTS map.

**Do NOT replace the existing map.** Add these entries to the existing LEGACY_REDIRECTS object alongside the ~72 entries already there.

## New entries to add:

```javascript
// Wave 2 — additional old URLs found in Google crawl logs

// Uppercase ticker/network
"/cbBTC/Mainnet": "/cbbtc/mainnet",

// Invalid network slug
"/usdc/eth": "/usdc",

// Old format: /{ticker}/{network}/{product} → /vault/{new-slug}
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

// Old vault slugs — missing network suffix or wrong word order
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
"/vault/usdc-apostro-resolv-euler": "/vault/usdc-resolv-euler-apostro-base",
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
"/vault/usdc-og-usdc-morpho-yearn": "/vault/usdc-og-morpho-yearn-base",
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
```

## After adding:

Total LEGACY_REDIRECTS should be ~148 entries (72 original + 76 new).

**Test these URLs after deploying:**
- `earnbase.finance/vault/wbtc-wbtc-pool-across-protocol` → should redirect to `/vault/wbtc-pool-across-protocol-mainnet`
- `earnbase.finance/usdc/base/morpho-prime-usdc-(gauntlet)` → should redirect to `/vault/usdc-prime-morpho-gauntlet-base`
- `earnbase.finance/vault/usdc-usdc-fusion-ipor` → should redirect to `/vault/usdc-ipor-fusion-mainnet`
- `earnbase.finance/cbBTC/Mainnet` → should redirect to `/cbbtc/mainnet`