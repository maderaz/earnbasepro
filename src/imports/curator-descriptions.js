# Earnbase — Curator Pages: Part 2 (Descriptions)

## Instruction for Figma AI

These are the "About {Curator}" descriptions for each curator page. Use them in the section from Task 5 in Part 1.

Store as a constant map. Key = curator slug, value = description string.

These are UNIQUE to curator pages. Do NOT reuse on vault pages or project pages.

```javascript
const CURATOR_DESCRIPTIONS = {

  "gauntlet": "Gauntlet is a quantitative risk research firm that has become one of the largest vault curators in DeFi, managing over a billion dollars across more than 60 vaults. Before entering vault curation, Gauntlet spent years as the risk management advisor for protocols like Aave, Compound, and Uniswap, building agent-based simulation models to optimize lending parameters and stress-test collateral under extreme market conditions. This deep protocol-level experience now informs how Gauntlet designs its own vaults. Gauntlet organizes its Morpho strategies into distinct risk tiers: Prime vaults allocate to blue-chip collateral with conservative parameters, Core vaults target moderate risk with broader collateral exposure, and Frontier vaults pursue higher yields by accepting more volatile assets. The same curator running all three tiers creates a natural comparison — the APY difference between a Gauntlet Prime vault and a Gauntlet Frontier vault reflects the market price of risk as assessed by the same risk model. Gauntlet also curates vaults on Euler across Ethereum, Base, and Arbitrum, including cluster vaults that combine multiple lending positions. For yield seekers evaluating Gauntlet strategies, the tiered structure makes risk-return tradeoffs explicit: each tier name signals the curator's own risk assessment.",

  "steakhouse": "Steakhouse Financial is the largest vault curator on Morpho by deposits, having grown from zero to over a billion dollars in user deposits within eighteen months. Founded by an ex-Goldman Sachs professional and a former MakerDAO core contributor, Steakhouse combines traditional finance structuring with DeFi-native risk management. The firm pioneered several risk innovations on Morpho, including the use of Aragon DAO guardians that give vault depositors veto rights over curator actions, and extended 7-day timelocks on all market changes. These depositor protections earned Steakhouse vaults the highest Credora ratings among Morpho curators. Steakhouse organizes strategies into Prime vaults for conservative blue-chip lending and High Yield vaults that access tokenized real-world assets and private credit alongside crypto-native collateral. The firm operates across Ethereum Mainnet, Base, and Arbitrum, with strategies spanning USDC, USDT, ETH, and EURC. Steakhouse was the first curator to bring tokenized private credit to Morpho, structuring a repo strategy that grew from zero to significant scale within weeks. For yield comparison, Steakhouse vaults offer a useful benchmark for depositor protection — if other curators show higher APY, the question is whether they match Steakhouse's timelock and guardian standards.",

  "re7": "Re7 Labs is a research-driven DeFi curator that manages vault strategies on Morpho across Ethereum Mainnet, Base, and Arbitrum. Re7 tends toward more aggressive allocations than conservative curators like Steakhouse or Gauntlet Prime, often including a broader set of collateral types and accepting higher utilization rates to target elevated yields. This positioning means Re7 vaults frequently appear in the upper range of APY rankings for the same asset, particularly on USDC where Re7 operates multiple vault variants. Re7 also curates EURC and WBTC strategies, giving it one of the broadest asset coverages among Morpho curators. The firm publishes research on DeFi lending dynamics and has established itself as a technically sophisticated curator with deep protocol-level knowledge. When comparing Re7 yields against more conservative curators, the APY premium typically reflects Re7's willingness to include collateral markets that others exclude — a trade-off between yield and collateral diversification risk that becomes visible when looking at the underlying market allocations.",

  "clearstar": "Clearstar Labs is a Swiss-based DeFi strategy curator backed by a family office with approximately one billion euros in assets under management. The firm combines backgrounds in private equity, investment banking, and DeFi operations to build vault strategies across Morpho, Euler, and IPOR. Clearstar deploys two main vault types on Morpho: High Yield vaults that optimize across both stable and volatile collateral markets, and Reactor vaults designed to maximize risk-adjusted returns through broader market exposure. Clearstar operates across Ethereum Mainnet, Base, and Arbitrum, often deploying the same strategy across multiple networks to capture network-specific rate differences. The firm also curates on other protocols beyond Morpho, including Euler and Upshift, making it one of the more platform-diversified curators tracked on Earnbase. Comparing Clearstar strategies across networks reveals how the same curator's approach produces different yield levels depending on local borrowing demand and liquidity conditions.",

  "mev-capital": "MEV Capital curates vault strategies on Morpho with a focus on maximizing yield through deep understanding of maximal extractable value dynamics and DeFi market microstructure. The firm operates strategies across USDC, ETH, and cbBTC on Ethereum Mainnet and Base. MEV Capital's approach to vault curation is informed by its expertise in transaction ordering and DeFi liquidity dynamics — an unusual background among curators that most focus on traditional risk modeling. MEV Capital's vaults tend to include frontier collateral markets and aggressive allocations, which can produce higher headline APY but with different risk characteristics than curators focused on blue-chip lending. For yield comparison, MEV Capital strategies are best evaluated against other aggressive-tier curators like Re7 rather than against conservative curators like Steakhouse or Gauntlet Prime.",

  "apostro": "Apostro curates lending strategies on both Euler and Morpho, with a presence on Ethereum Mainnet, Base, and BNB Chain. This multi-protocol approach is notable — most curators focus on a single lending protocol, while Apostro has built vault strategies across different architectures. On Euler, Apostro curates standalone vaults, while on Morpho the firm manages allocated lending strategies. Apostro also maintains Resolv-focused vaults that allocate specifically to Resolv collateral markets, targeting yield from this particular asset class. The firm operates across USDC and EURC, with strategies deployed on multiple networks. Comparing Apostro vaults across Euler and Morpho can reveal how the same curator's philosophy produces different results on different underlying protocol architectures.",

  "9summits": "9Summits curates yield strategies across both Morpho and Lagoon, operating on Ethereum Mainnet and Avalanche. The firm's strategies include Turtle vaults on Morpho that target conservative, risk-adjusted yield, and Flagship vaults on Lagoon that allocate across DeFi lending markets. 9Summits is one of the few curators tracked on Earnbase that operates on Avalanche, where its Lagoon vaults provide yield exposure to a network with different liquidity dynamics than Ethereum or Base. The firm manages strategies for USDC and ETH, with each vault reflecting a defined risk profile. For users specifically seeking Avalanche-native yield opportunities, 9Summits represents one of the primary curated options available.",

  "kpk": "kpk, formerly known as karpatkey, is one of the pioneering onchain asset managers in DeFi, with a track record managing treasuries for major protocols including Gnosis, ENS, Nexus Mutual, and Balancer since 2020. The firm has executed over fifteen thousand onchain transactions without loss of funds. kpk's vault curation approach is distinctive for its use of agent-powered automation — deterministic onchain agents that manage liquidity rebalancing and risk responses within seconds, operating within strictly defined policy parameters rather than relying on manual curator decisions. kpk curates strategies on both Morpho and Gearbox, spanning USDC and ETH on Ethereum Mainnet and Arbitrum. The Gearbox strategies involve leveraged positions, while the Morpho vaults focus on standard lending optimization. This dual-protocol approach means kpk manages both leveraged and unleveraged yield strategies, and comparing across them reveals the yield premium that leverage adds against the additional liquidation risk it introduces.",

  "wintermute": "Wintermute is one of the largest crypto market makers globally, providing liquidity across hundreds of exchanges and DeFi protocols. On Earnbase, Wintermute appears as a borrower on Wildcat, the private credit protocol — rather than curating lending vaults, Wintermute borrows capital from DeFi lenders at fixed rates to fund its market-making operations. This makes Wintermute-linked yields structurally different from other curators: the rate reflects what a major institutional borrower is willing to pay for capital, not variable DeFi lending supply and demand. Wintermute Private Credit vaults are available for USDC, USDT, ETH, and cbBTC on Ethereum Mainnet. The fixed-rate nature of these yields makes them a useful benchmark — when Wintermute's borrowing rates exceed variable DeFi lending rates, it signals strong institutional demand for capital. Comparing Wintermute's fixed rates against variable curator yields shows the premium institutions pay for undercollateralized DeFi access.",

  "yearn": "Yearn's strategies appear under the Yearn curator label on platforms like Morpho, representing the protocol's managed approach to vault allocation. Rather than deploying on its own infrastructure exclusively, Yearn curates Morpho vaults that leverage its allocation expertise within Morpho's isolated lending markets. These strategies often carry the OG Compounder branding, combining Yearn's historical yield optimization knowledge with Morpho's market infrastructure. Yearn-curated vaults span USDC and USDT on Ethereum Mainnet and Base. The firm's long history in DeFi yield optimization — dating back to 2020 — gives it one of the longest track records among active curators, with observable yield patterns across multiple market cycles.",

};
```

---

## Notes

- Each description is 6-10 sentences, written from a yield comparison perspective.
- Descriptions highlight what makes each curator's approach DIFFERENT — risk tiers, protocol choices, automation, leverage, fixed rates, etc.
- Descriptions reference specific platform names, network names, and strategy types for long-tail SEO.
- Descriptions do NOT include external links.
- Descriptions do NOT include specific APY numbers (change daily).
- Descriptions do NOT include Earnbase tracking stats — those are added dynamically in the template.
- The threshold for curator pages is 4+ strategies. Curators below 4 do NOT get descriptions here. If they cross the threshold later, write a new description and add it.
- If a curator slug is not found in this map, use a dynamic fallback: `"{CuratorName} curates yield strategies tracked on Earnbase. Compare APY rates, TVL, and performance across all {CuratorName}-managed strategies."` — but prefer adding a real description.

---

## Curators Below Threshold (no page yet)

These curators have 3 strategies currently. They do NOT get curator pages. If they add 1+ more strategies, pages will appear automatically (dynamic threshold) but they will need descriptions added here:

- **Reservoir** (3) — IPOR Fusion leveraged looping strategies
- **Tulipa** (3) — Euler curated vaults
- **TAU Labs** (3) — IPOR Fusion strategies on Ethereum
- **Hyperithm** (3) — Wildcat private credit + Morpho vaults

---

End of Part 2.