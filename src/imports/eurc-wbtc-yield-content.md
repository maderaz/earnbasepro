# Earnbase — Hub Page Content Rewrites (EURC, WBTC, cbBTC)

## Instruction for Figma AI

Same layout rules as the USDC/ETH/USDT document. Replace existing "About {Asset} Yields" section content. Split into 3 subsections with H3 headings. Same styling, same max-width, same spacing. No bullet points, no external links.

---

## EURC Hub Page (/eurc)

### H2: About EURC Yields

### H3: Euro-Denominated Yield in DeFi

EURC is a euro-pegged stablecoin issued by Circle, the same company behind USDC. It holds a 1:1 peg to the euro with reserves in euro-denominated cash and equivalents. EURC represents a relatively new asset class in DeFi — while dollar stablecoins dominate lending markets, euro-denominated yield opportunities have expanded significantly as protocols deploy on networks like Base where EURC liquidity has grown.

The fundamental yield mechanic for EURC mirrors USDC: depositors supply EURC to lending protocols, borrowers pay interest, and that interest accrues to depositors. However, EURC borrowing demand comes from different sources than dollar stablecoins. Euro-denominated borrowers include European institutions hedging currency exposure, traders arbitraging EUR/USD rates across DeFi and CeFi, and protocols building euro-native products. This borrower base is smaller but growing, which means EURC rates can be more volatile than USDC as individual large borrowing positions have outsized impact on utilization.

### H3: Where EURC Yield Lives

EURC yield strategies are concentrated on fewer protocols than dollar stablecoins, which reflects the asset's earlier stage of DeFi adoption. Morpho hosts curated EURC vaults managed by Gauntlet and Steakhouse, both on Ethereum Mainnet and Base. Euler offers EURC vaults on Base. Aave provides pooled EURC lending on both Mainnet and Base. Beyond curated vaults, Moonwell offers EURC lending on Base, and ExtraFi and Fluid provide additional Base-native options.

Base has emerged as the primary network for EURC yield activity. The majority of EURC strategies tracked on Earnbase are deployed on Base, reflecting the network's role as a hub for newer stablecoin ecosystems. Ethereum Mainnet hosts the more established EURC vaults from Gauntlet and Aave, typically with larger TVL and more stable rates. Comparing the same curator's EURC vault across Mainnet and Base reveals how network-level liquidity differences translate into rate differences — Base vaults often show higher APY due to thinner supply relative to borrowing demand.

### H3: EURC Yields for Euro-Based Investors

For investors whose base currency is the euro, EURC yields eliminate the currency risk inherent in earning dollar-denominated yield on USDC or USDT. A European depositor earning 5% APY on USDC also carries EUR/USD exchange rate exposure — if the dollar weakens against the euro, some or all of that yield can be erased in purchasing power terms. EURC yields, while typically fewer in number and sometimes lower in headline APY, deliver returns denominated in the same currency the depositor spends.

Earnbase tracks EURC strategies with the same methodology applied to all assets: APY reflects on-chain vault performance only, excluding external token incentives. For EURC specifically, this distinction matters because several protocols offer incentive programs to bootstrap euro liquidity — these temporary rewards can make EURC yields appear artificially high on other aggregators. The rates on Earnbase show the sustainable lending yield that remains after incentive programs end, which provides a clearer picture of long-term euro-denominated DeFi returns.

### Dynamic stat line:
```
Earnbase tracks {strategyCount} EURC yield strategies across {networkCount} networks and {platformCount} platforms — updated daily.
```

---

## WBTC Hub Page (/wbtc)

### H2: About WBTC Yields

### H3: How WBTC Generates Yield

WBTC (Wrapped Bitcoin) is an ERC-20 token backed 1:1 by Bitcoin, custodied by BitGo. It brings Bitcoin's value into the Ethereum DeFi ecosystem, allowing BTC holders to earn yield without selling their Bitcoin exposure. Unlike stablecoins where yield represents a dollar return, WBTC yield means accumulating more Bitcoin-denominated value — a 4% APY on WBTC means 4% more WBTC over a year, with the dollar value depending entirely on Bitcoin's price.

WBTC yield comes primarily from lending. Borrowers take out WBTC loans on protocols like Aave, Morpho, and Spark to gain short exposure, to use as collateral in other strategies, or to bridge between Bitcoin and DeFi positions. Because WBTC has deep liquidity on Ethereum Mainnet and moderate liquidity on Arbitrum, lending rates reflect borrowing demand across these networks. WBTC lending rates tend to be lower than stablecoin rates because borrowing demand for BTC is structurally smaller — fewer DeFi strategies require borrowing Bitcoin compared to the constant demand for borrowed stablecoins.

### H3: WBTC Strategy Landscape

The WBTC yield landscape on Earnbase spans lending pools, curated vaults, and leveraged strategies. On Aave, WBTC lending is straightforward single-protocol exposure with pooled risk. Morpho offers curated WBTC vaults — Gauntlet manages Core and Vault Bridge strategies on Mainnet, Re7 operates a WBTC vault, and MEV Capital curates a Pendle-integrated WBTC strategy. Spark provides a lending market for WBTC with MakerDAO ecosystem integration.

Beyond vanilla lending, IPOR Fusion hosts leveraged BTC yield strategies curated by Reservoir that use recursive looping to amplify returns. Gearbox offers WBTC lending through leveraged pools. These higher-yield strategies come with leverage risk — during sharp BTC price movements, leveraged WBTC positions can face liquidation, which is a different risk profile than simple lending where the main concern is borrower default against posted collateral.

WBTC strategies are concentrated on Ethereum Mainnet and Arbitrum. Mainnet hosts the largest TVL and most curated options, while Arbitrum provides access through Aave, Dolomite, and Euler. The Mainnet concentration reflects where WBTC liquidity historically lives — unlike USDC which has spread aggressively across L2s, WBTC DeFi activity remains anchored on Ethereum's base layer.

### H3: Evaluating WBTC Yields

When comparing WBTC yields, the context differs from stablecoins in an important way. A WBTC vault showing 3% APY during a BTC bull market represents a meaningful return because the underlying asset is already appreciating in dollar terms — the yield compounds on top of price gains. During bear markets, that same 3% APY provides a partial buffer against price declines. This asymmetry means WBTC yield strategies serve a different purpose than stablecoin strategies: they optimize Bitcoin exposure rather than generating dollar income.

Earnbase's methodology of excluding external incentives is particularly relevant for WBTC. Several protocols offer token rewards specifically to attract Bitcoin liquidity — these can make headline yields appear double or triple the actual lending rate. The APY shown on Earnbase reflects what WBTC lending markets genuinely earn from borrower interest, providing a baseline for evaluating whether a WBTC yield strategy adds enough return to justify the smart contract risk of deploying Bitcoin into DeFi rather than holding it directly.

### Dynamic stat line:
```
Earnbase tracks {strategyCount} WBTC yield strategies across {networkCount} networks and {platformCount} platforms — updated daily.
```

---

## cbBTC Hub Page (/cbbtc)

### H2: About cbBTC Yields

### H3: cbBTC and the Base Ecosystem

cbBTC is Coinbase's wrapped Bitcoin token, launched as a competitor to WBTC with a distinct custodial model — Coinbase itself holds the underlying Bitcoin rather than the multi-party custody system used by WBTC. cbBTC has found its primary DeFi home on Base, Coinbase's L2 network, where it benefits from native integration with the broader Coinbase ecosystem. This Base-first distribution means cbBTC yield opportunities are heavily concentrated on one network, creating a different landscape than WBTC which spans Mainnet and Arbitrum more evenly.

cbBTC generates yield through the same mechanism as WBTC: lending to borrowers who need Bitcoin exposure within DeFi. On Base, cbBTC lending is available across a wide range of protocols — Moonwell, Morpho, Euler, YO, ExtraFi, Arcadia, and others all support cbBTC deposits. This protocol diversity within a single network is notable: Base has become the most competitive environment for cbBTC yield, with multiple protocols and curators competing for the same Bitcoin liquidity.

### H3: cbBTC vs WBTC Yield Comparison

cbBTC and WBTC represent the same underlying asset — Bitcoin — but their yield profiles diverge because they operate in different liquidity environments. WBTC has deeper Mainnet liquidity and a longer DeFi track record, which generally means more stable rates and higher TVL per vault. cbBTC has stronger Base-native liquidity and benefits from Coinbase integration, which attracts borrowers and lenders who already operate within the Coinbase ecosystem.

In practice, cbBTC yields on Base often exceed WBTC yields on Mainnet for the same protocol type because Base's cbBTC supply is thinner relative to demand. A Gauntlet Core vault for cbBTC on Base may show higher APY than the equivalent WBTC Core vault on Mainnet simply because less cbBTC is deposited, pushing utilization and rates higher. However, this higher yield comes with the trade-off of operating on a newer network with a younger liquidity profile. Comparing cbBTC and WBTC side by side on Earnbase reveals these structural differences — the same curator applying the same risk framework to both assets produces different yields because the underlying market dynamics differ.

### H3: Navigating cbBTC Strategies

The cbBTC strategy set on Earnbase is one of the most diverse for any single asset on a single network. On Base alone, cbBTC is available through Morpho curated vaults from Gauntlet, Re7, and MEV Capital; Euler vaults; Moonwell lending; YO core vaults; Arcadia lending pools; ExtraFi; and multiple Harvest and Beefy autocompounders. Mainnet options include Aave lending, Morpho curated vaults, Euler Prime, and Wildcat private credit via Wintermute.

This density of options means cbBTC depositors face a genuine selection problem — there are enough strategies that simply sorting by highest APY is insufficient. The curator, protocol architecture, and collateral exposure all matter. A Gauntlet Core cbBTC vault on Morpho has a fundamentally different risk profile than a cbBTC autocompounder on Beefy that layers on top of Moonwell, even if both show similar headline APY. The sustainability score and TVL columns help differentiate: larger TVL and higher sustainability scores generally indicate strategies where sophisticated capital has already done due diligence, while smaller, newer vaults may offer higher rates with less proven track records.

### Dynamic stat line:
```
Earnbase tracks {strategyCount} cbBTC yield strategies across {networkCount} networks and {platformCount} platforms — updated daily.
```

---

## Implementation Notes

Same rules as the USDC/ETH/USDT document:

1. Replace existing "About" section content — don't duplicate.
2. H3 subheadings mandatory for visual breakup.
3. Dynamic stat line at the end with computed values.
4. No external links. Internal links to /project/ and /curator/ pages only after they're live.
5. Character counts: EURC ~2,500 chars, WBTC ~2,800 chars, cbBTC ~2,700 chars.

---

End of document.