# Earnbase — Hub Page Content Rewrites (USDC, ETH, USDT)

## Instruction for Figma AI

### Visual Layout Rules

The "About {Asset}" section currently exists below the product table and above the FAQ. Replace its content with the new text below.

**DO NOT** render this as one block of text. Split it into **3 visually distinct subsections**, each with its own heading. Use the H2 for the main section title and H3s for the subsections.

**Layout pattern:**

```
<h2>About {Asset} Yields</h2>

<h3>{Subsection 1 Title}</h3>
<p>2-3 paragraphs</p>

<h3>{Subsection 2 Title}</h3>
<p>2-3 paragraphs</p>

<h3>{Subsection 3 Title}</h3>
<p>2-3 paragraphs</p>

<p class="tracking-stat">{Dynamic stat line}</p>
```

**Styling guidance:**
- H2: same as existing section headings (e.g., "Frequently Asked Questions")
- H3: slightly smaller than H2, same font, medium weight. Add ~32px top margin to create breathing room between subsections.
- Paragraphs: same body text style as existing. Max-width ~720px for readability. Line-height 1.6–1.7.
- Tracking stat line at the bottom: slightly muted text color (same as existing dynamic stat lines on project pages).
- NO decorative cards, boxes, or backgrounds around the text. Clean typography only.
- NO bullet points. All prose.

**Do NOT change:**
- The H1, intro paragraph, stats row, asset cards, or product table above
- The FAQ section below
- Any other page elements

---

## USDC Hub Page (/usdc)

### H2: About USDC Yields

### H3: How USDC Yield Works in DeFi

USDC is a dollar-pegged stablecoin issued by Circle with reserves held in cash and short-term U.S. Treasuries. In DeFi, USDC generates yield primarily through lending — depositors supply USDC to a protocol, borrowers pay interest on it, and that interest flows back to depositors as yield. Because USDC maintains a stable $1 peg, the APY you see represents real dollar-denominated returns without the price volatility that affects assets like ETH or BTC.

The range of USDC yields across DeFi is wide. Conservative lending on blue-chip protocols like Aave or Compound typically produces lower single-digit APY driven purely by borrowing demand. Curated Morpho vaults managed by firms like Gauntlet or Steakhouse allocate deposits across multiple isolated lending markets, often capturing higher rates by accepting a broader range of collateral. At the upper end, leveraged looping strategies on IPOR Fusion amplify yield by recursively borrowing and re-depositing USDC, which increases returns but also introduces liquidation risk.

### H3: What Drives USDC Rate Differences

USDC rates vary across protocols, networks, and strategies because of three factors: borrowing demand, collateral risk, and strategy complexity. A Morpho vault that lends against blue-chip collateral like wstETH will typically offer lower APY than one that accepts more volatile or newer collateral types. The same vault deployed on Base may produce different yields than on Ethereum Mainnet because borrowing demand and liquidity conditions differ by network.

Curators play a significant role in USDC yield. On Morpho, curators like Gauntlet, Steakhouse, and Re7 each manage dozens of USDC vaults with different risk profiles — Prime, Core, and Frontier tiers offer progressively higher APY with correspondingly broader collateral exposure. Comparing the same curator's Prime vault against their Frontier vault reveals the market price of incremental risk. Across protocols, architectural differences matter too: Euler's isolated lending markets, Fluid's smart collateral, and Aave's pooled model each produce different rate dynamics even when serving the same USDC borrowing demand.

### H3: Comparing USDC Yields on Earnbase

Earnbase tracks USDC strategies across multiple protocols and networks with one important distinction: all APY figures reflect on-chain vault performance only. External incentives like token rewards, points programs, and liquidity mining emissions are excluded. This matters because many DeFi interfaces show inflated APY that includes temporary incentives which can disappear overnight. The rates on Earnbase represent what the vault's core strategy actually earns from lending activity.

When comparing USDC yields, the sustainability score helps distinguish between strategies with consistent returns and those with volatile rate swings. A vault showing 12% APY with a sustainability score of 30 tells a different story than one at 8% with a score of 90. TVL is another signal — large deposits in a lending vault compress rates through supply-demand dynamics, so the highest-TVL vaults rarely show the highest APY. Sorting by 30-day APY rather than 24-hour APY gives a more reliable picture, since daily rates can spike temporarily due to liquidation events or sudden borrowing demand.

### Dynamic stat line:
```
Earnbase tracks {strategyCount} USDC yield strategies across {networkCount} networks and {platformCount} platforms — updated daily.
```

---

## ETH Hub Page (/eth)

### H2: About ETH Yields

### H3: Sources of ETH Yield

ETH generates yield through fundamentally different mechanisms than stablecoins. The base layer of ETH yield comes from Ethereum's proof-of-stake consensus — validators earn staking rewards for proposing and attesting blocks, currently producing a baseline APY that fluctuates with network activity and the total amount of ETH staked. Liquid staking protocols like Lido (stETH), Coinbase (cbETH), and Rocket Pool (rETH) make these staking rewards accessible without running validator infrastructure, issuing liquid tokens that represent staked ETH plus accumulated rewards.

On top of staking yield, DeFi lending adds a second layer. Protocols like Aave, Morpho, Fluid, and Euler let users deposit ETH (typically as WETH) into lending pools where borrowers pay interest. These borrowers are often leveraged traders or yield farmers who need ETH as collateral or for short positions, and their demand fluctuates with market conditions. During volatile markets, ETH borrowing demand spikes and lending rates rise. During quiet periods, rates compress. This cyclical dynamic means ETH lending APY is inherently less stable than stablecoin lending.

### H3: ETH Yield Strategies Compared

The simplest ETH yield comes from holding a liquid staking token — stETH appreciates against ETH at roughly the staking rate with minimal additional smart contract risk beyond the staking protocol itself. One step up, lending WETH on Aave or Compound earns borrowing interest on top of nothing (plain WETH doesn't stake), while lending wstETH earns staking rewards plus borrowing interest simultaneously.

Curated vaults add active management to the mix. On Morpho, curators like Gauntlet manage ETH vaults across risk tiers — their WETH Prime vaults stick to blue-chip collateral markets while Ecosystem vaults accept a wider range of assets as collateral. The choice between these tiers reflects a tradeoff between yield and collateral quality that each depositor evaluates differently. On Gearbox, kpk curates leveraged ETH vaults that amplify yield through controlled borrowing — these produce higher APY but carry liquidation risk if market conditions move sharply. IPOR Fusion strategies take a different approach entirely, using leveraged looping of staked ETH derivatives to stack staking yield on top of lending yield.

### H3: Reading ETH Yields on Earnbase

ETH yields on Earnbase require more careful interpretation than stablecoin yields because the underlying asset itself is volatile. A vault showing 5% APY on ETH means 5% more ETH over a year — but the dollar value of that ETH depends entirely on ETH's price. This is fundamentally different from USDC where 5% APY means 5% more dollars.

Earnbase excludes external incentives from all displayed APY, which is especially relevant for ETH strategies. Many protocols offer token incentives on ETH deposits (ARB rewards on Arbitrum, OP on Optimism) that temporarily inflate apparent yields. The rates shown here reflect what the strategy earns from its core mechanism — staking rewards, lending interest, or trading fees — without these overlays. For ETH strategies specifically, comparing the 30-day APY against the current Ethereum staking rate gives a useful benchmark: any vault consistently producing APY significantly above the base staking rate is taking on additional risk through lending, leverage, or collateral exposure that goes beyond vanilla staking.

### Dynamic stat line:
```
Earnbase tracks {strategyCount} ETH yield strategies across {networkCount} networks and {platformCount} platforms — updated daily.
```

---

## USDT Hub Page (/usdt)

### H2: About USDT Yields

### H3: USDT Yield in DeFi Lending

USDT is the most widely traded stablecoin by volume, issued by Tether with reserves that include U.S. Treasuries, cash equivalents, and other financial assets. In DeFi lending markets, USDT often commands different interest rates than USDC despite both tracking the dollar. This rate divergence exists because USDT and USDC serve partially different borrower bases — USDT is more heavily used in perpetual futures markets and CeFi-DeFi arbitrage, creating pockets of borrowing demand that don't always align with USDC markets.

USDT yield strategies on Earnbase span the same protocol types as USDC — lending pools on Aave and Compound, curated Morpho vaults, IPOR Fusion strategies, and Gearbox leveraged positions — but with generally fewer options. Most DeFi vault curators prioritize USDC as their primary stablecoin asset, which means the USDT curator landscape is thinner. Steakhouse, Gauntlet, and Re7 all manage USDT vaults on Morpho, and B.Protocol curates a flagship USDT vault, but the overall selection is narrower than what exists for USDC.

### H3: USDT vs USDC Rate Dynamics

Comparing USDT and USDC yields side by side reveals structural differences in how each stablecoin is used within DeFi. USDT lending rates on the same protocol can run higher or lower than USDC depending on relative borrowing demand. When USDT trades at a slight premium on centralized exchanges, arbitrageurs borrow USDT in DeFi to sell elsewhere, pushing DeFi lending rates up. When market stress causes USDT to trade at a discount, borrowing demand drops and rates fall faster than USDC.

This dynamic means USDT strategies can occasionally offer a yield premium over equivalent USDC strategies on the same protocol and network. However, this premium reflects a combination of genuine rate differences and the distinct risk profile that USDT carries relative to USDC. Depositors evaluating USDT yields should consider both the headline APY and the sustainability score — USDT rates tend to be more volatile than USDC rates on the same protocol because USDT borrowing demand is more sensitive to market conditions.

### H3: Evaluating USDT Strategies on Earnbase

The USDT strategy set on Earnbase is more concentrated than USDC, which actually simplifies comparison. With fewer curators and protocols offering USDT vaults, the differences between available strategies become clearer. Steakhouse's USDT vaults on Morpho follow the same conservative curation framework as their USDC vaults, while the Smokehouse-branded strategies target higher yields. Gauntlet's USDT Prime vault sits at the conservative end of their risk spectrum. On Yearn and Compound, USDT strategies involve single-protocol lending without curator overlay.

Because the USDT strategy universe is smaller, individual vault changes have a more visible impact on the available yield range. A new USDT vault launching on Morpho or an existing curator adjusting their USDT allocation can noticeably shift the top-APY picture. Sorting by 30-day APY rather than 24-hour rate smooths out these shifts and provides a more stable comparison basis. The TVL column is particularly informative for USDT — the largest USDT vaults by TVL represent where sophisticated capital is concentrating, which itself is a signal about which strategies institutional depositors consider acceptable.

### Dynamic stat line:
```
Earnbase tracks {strategyCount} USDT yield strategies across {networkCount} networks and {platformCount} platforms — updated daily.
```

---

## Implementation Notes

1. **Replace content only.** The "About {Asset} Yields" section already exists on each hub page. Replace the current text with the new content above. Do not add a new section or duplicate the heading.

2. **H3 subheadings are mandatory.** They break up the wall of text and give Google crawlable section anchors. Without them, the content will look like a Wikipedia article.

3. **Dynamic stat line** at the end should use the same computed values as the intro paragraph (strategyCount, networkCount, platformCount). Style it the same as tracking stats on project pages.

4. **Do NOT add external links** anywhere in these sections. No links to Circle, Tether, Lido, etc.

5. **Internal links are OK** where they reference Earnbase pages. For example, mentions of "Morpho" could link to `/project/morpho` and mentions of "Gauntlet" could link to `/curator/gauntlet` — but ONLY after those pages are live. If project/curator pages aren't deployed yet, leave all references as plain text and add links later.

6. **Character counts:** USDC ~2,800 chars, ETH ~2,900 chars, USDT ~2,700 chars. Each is 6-9 paragraphs split across 3 subsections. This is substantial enough for SEO without being overwhelming.

7. **After implementing these three**, I will provide content for EURC, WBTC, and cbBTC in a separate document.

---

End of document.