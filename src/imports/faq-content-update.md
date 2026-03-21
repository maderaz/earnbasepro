Dodajmy 4 nowe pytania per token które celują w dodatkowe long-tail keywords. Daj to Figma AI:

USDC (dodaj pod istniejącymi 6):
Q: What is the difference between USDC Prime and Frontier vaults?
A: Prime vaults lend against blue-chip collateral like wstETH and typically offer lower but more stable APY. Frontier vaults accept a broader range of collateral assets, which increases yield but also introduces more collateral risk. The tier name reflects the curator's own risk assessment.
Q: Why do USDC rates differ between Ethereum and Base?
A: Borrowing demand and liquidity supply vary by network. Base often has thinner USDC supply relative to demand, pushing rates higher. Ethereum Mainnet has deeper liquidity, which generally compresses rates. The same vault from the same curator can produce different APY on each network.
Q: What does the sustainability score mean for USDC strategies?
A: The sustainability score measures how consistent a strategy's yield has been over the past 30 days on a scale of 0 to 100. A score above 90 means very stable returns. A score below 50 indicates significant rate volatility. It helps distinguish reliably productive strategies from those with spiking rates.
Q: Are USDC yields on Earnbase inclusive of token rewards?
A: No. All APY figures on Earnbase reflect on-chain vault performance only. External incentives like governance token rewards, points programs, and liquidity mining emissions are excluded. This means rates shown here may appear lower than on other aggregators that include temporary incentives.

ETH (dodaj pod istniejącymi):
Q: What is the difference between staking yield and lending yield on ETH?
A: Staking yield comes from Ethereum's proof-of-stake consensus, earned by validators for securing the network. Lending yield comes from borrowers paying interest to use deposited ETH. Some strategies combine both by lending liquid staking tokens like wstETH, earning staking rewards plus borrowing interest simultaneously.
Q: Why is ETH APY shown in ETH terms, not dollars?
A: ETH yield strategies produce more ETH, not more dollars. A 5% APY means 5% more ETH over a year. The dollar value of that return depends on ETH's price, which can move significantly. This is fundamentally different from stablecoin yields where APY directly represents dollar returns.
Q: Which ETH strategies on Earnbase carry leverage risk?
A: Leveraged strategies include IPOR Fusion looping vaults and Gearbox leveraged positions. These amplify yield by recursively borrowing and re-depositing, but they also carry liquidation risk during sharp price movements. Non-leveraged strategies like Aave lending or Morpho curated vaults do not use leverage.
Q: How does ETH borrowing demand affect yield?
A: ETH lending rates rise when more traders want to borrow ETH for short positions, leverage, or arbitrage. During volatile markets, borrowing demand spikes and rates increase. During quiet periods, demand drops and rates compress. This makes ETH lending APY inherently more cyclical than stablecoin lending.

USDT (dodaj pod istniejącymi):
Q: Why does USDT sometimes offer higher APY than USDC on the same protocol?
A: USDT and USDC serve different borrower bases. USDT is more heavily used in perpetual futures and CeFi-DeFi arbitrage, creating demand spikes that push lending rates above USDC. This premium is not guaranteed and reverses when USDT borrowing demand drops.
Q: Are there fewer USDT strategies than USDC on Earnbase?
A: Yes. Most DeFi vault curators prioritize USDC as their primary stablecoin, which means fewer curated USDT vaults exist. However, the smaller selection makes comparison simpler, and the strategies that do exist represent where institutional capital has concentrated.
Q: What is the Smokehouse USDT vault?
A: Smokehouse is a higher-yield vault variant curated by Steakhouse Financial on Morpho. It accepts a broader range of collateral than Steakhouse's standard USDT vault, targeting elevated APY with correspondingly wider risk exposure. The name distinguishes it from Steakhouse's more conservative offerings.
Q: Does USDT carry different risks than USDC in DeFi?
A: The smart contract and protocol risks are similar, but the stablecoin issuer risk differs. USDT is issued by Tether with reserves that include various financial assets, while USDC is issued by Circle with reserves in cash and short-term U.S. Treasuries. Each depositor evaluates this issuer-level difference according to their own risk tolerance.

Dodaj te do FAQPage JSON-LD schema razem z istniejącymi pytaniami. Powinno wyrównać kolumny wizualnie (10 pytań po prawej vs ~10 paragrafów po lewej).