# Earnbase — Project Pages (Part 1: Architecture & Tasks)

## Instruction for Figma AI

New page type: project pages at `/project/{slug}`. These pages show all yield strategies tracked on Earnbase for a specific platform/project.

**IMPORTANT: Break this into mini tasks. Complete and test each task before starting the next.**

---

## Which Projects Get a Page

Only projects with 3 or more tracked strategies get a `/project/` page. This avoids thin content pages.

Current qualifying projects (20):

| Project | Slug | Strategies |
|---------|------|-----------|
| Morpho | morpho | 103 |
| Euler | euler | 33 |
| Aave | aave | 22 |
| IPOR Fusion | ipor-fusion | 20 |
| Harvest | harvest | 18 |
| Yearn | yearn | 10 |
| Lagoon | lagoon | 10 |
| Fluid | fluid | 9 |
| Beefy | beefy | 7 |
| Gearbox | gearbox | 5 |
| Wildcat | wildcat | 5 |
| Spark | spark | 5 |
| YO | yo | 4 |
| Compound | compound | 4 |
| Yearn V2 | yearn-v2 | 4 |
| Moonwell | moonwell | 3 |
| ExtraFi | extrafi | 3 |
| Tokemak | tokemak | 2* |
| Silo | silo | 2* |
| Arcadia | arcadia | 2* |

*Tokemak, Silo, and Arcadia are borderline at 2 strategies. Include them if the project adds more products later — or skip for now and add when they reach 3. Your call.*

Projects with 1-2 strategies do NOT get a page: AutoFinance, Across, Origin Protocol, Dolomite, Venus, Avantis, 40 Acres, Kinza, Maple, etc. Their products are still visible on hub pages and vault pages.

---

## URL Structure

Pattern: `/project/{slug}`

Slug derivation:
```javascript
function projectToSlug(projectName) {
  return projectName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
```

Examples:
- Morpho → `/project/morpho`
- IPOR Fusion → `/project/ipor-fusion`
- Yearn V2 → `/project/yearn-v2`
- 40 Acres → `/project/40-acres` (if included)
- ExtraFi → `/project/extrafi`

---

## SEO Meta Tags

### Title template:
```
{Project} Yields — Compare {strategyCount} APY Rates | Earnbase
```
Example: `Morpho Yields — Compare 103 APY Rates | Earnbase`

### Description template:
```
Compare {strategyCount} {Project} yield strategies across {tickerList}. Track APY, TVL, and performance data for {Project} vaults — updated daily on Earnbase.
```
Example: `Compare 103 Morpho yield strategies across USDC, ETH, USDT, WBTC, and cbBTC. Track APY, TVL, and performance data for Morpho vaults — updated daily on Earnbase.`

### Canonical:
```html
<link rel="canonical" href="https://earnbase.finance/project/{slug}" />
```

---

## Task 1: Routing + Basic Page Shell

Create a new route `/project/{slug}` that renders a ProjectPage component.

Extract the slug from the URL. Look up the matching project name from the Index table. If no products match this slug, show a 404-style page (not an empty table).

For now, just render the project name as H1 and show "Found {n} strategies".

**Validation:** If the slug doesn't match any platform in the data, do NOT render an empty page. Show a proper "not found" state. This prevents garbage URLs like `/project/banana` from becoming indexable thin pages.

**Test:** Visit `/project/morpho` — should show "Morpho" and "Found 103 strategies" (or current count).

---

## Task 2: H1, Intro, Stats Row

### H1:
```
{Project} Yields — Compare APY Across {tickerCount} Assets
```

### Intro paragraph:
```
Earnbase tracks {strategyCount} yield strategies on {Project} across {networkCount} networks. Compare APY rates for {tickerList} — updated daily.
```

### Stats row (horizontal, 3 numbers):
```
{strategyCount}        {networkCount}        {tickerCount}
Strategies Tracked     Networks              Assets
```

### Data computation:
```javascript
const projectProducts = products.filter(p => projectToSlug(p.platform) === slug);
const strategyCount = projectProducts.length;
const networks = [...new Set(projectProducts.map(p => p.network))];
const tickers = [...new Set(projectProducts.map(p => p.ticker.toUpperCase()))];
const tickerList = tickers.join(', ');
```

**Test:** Visit `/project/aave` — correct H1, intro with real numbers, stats row.

---

## Task 3: Product Table

Add the standard product table below the stats row. Same table component used on hub pages but filtered by project.

Columns: Product Name, Asset (ticker icon + name), Network, 24h APY, 7d APY, 30d APY, TVL

Each row links to `/vault/{slug}`.

Default sort: 24h APY descending. All columns sortable.

Add ticker filter buttons above the table (same as hub pages): ALL | USDC | ETH | USDT | etc. Only show tickers that exist on this platform.

**Test:** Visit `/project/morpho` — full table with 103 products, filterable by ticker.

---

## Task 4: "Assets on {Project}" Cards

Add between stats row and product table.

### Heading:
```
Assets on {Project}
```

### Layout:
One compact card per ticker. Each card shows:
```
[Ticker Icon] {TICKER}
{count} strategies · Best: {topAPY}% APY
```

Each card links to the hub page: `/{ticker}`

Only show tickers that have products on this platform.

**Test:** Visit `/project/euler` — cards for each available ticker with counts and top APY.

---

## Task 5: "About {Project}" Section

Add below the product table.

### Heading:
```html
<h2>About {Project}</h2>
```

### Content:
Use the descriptions from Part 2 document (earnbase-project-descriptions.md). Each project has a 4-6 sentence SEO description.

After the description, add:
```
Earnbase tracks {strategyCount} strategies on {Project} across {networkList}.
```

NO external links in this section. No "Visit {Project}" links.

**Test:** Visit `/project/wildcat` — should show the Wildcat description + tracking stat.

---

## Task 6: FAQ Section

Add below "About {Project}".

### 4 questions per project page (dynamic):

**Q1:** `What is the highest APY on {Project}?`
**A1:** `The highest yield currently tracked on {Project} is {topAPY}% APY on {topProductName} ({topTicker} on {topNetwork}). Rates are variable and update daily.`

**Q2:** `How many strategies does Earnbase track on {Project}?`
**A2:** `Earnbase tracks {strategyCount} yield strategies on {Project} across {tickerCount} assets and {networkCount} networks.`

**Q3:** `What assets can I earn yield on with {Project}?`
**A3:** `{Project} supports yield strategies for {tickerList}. Each asset has multiple strategies with different risk profiles and APY rates.`

**Q4:** `Does {Project} yield include external rewards?`
**A4:** `No. APY shown on Earnbase reflects on-chain vault performance only. External incentives such as token rewards, points programs, and liquidity mining are excluded.`

Wrap in FAQ schema (same as hub pages):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
</script>
```

**Test:** Visit `/project/morpho` — 4 FAQ items with correct dynamic data + schema markup.

---

## Task 7: Internal Linking + Sitemap

### Link TO project pages from:
1. **Vault pages:** In the "About {Platform}" section, make the platform name a link to `/project/{slug}` (only if the project has a page).
2. **Hub pages:** In the product table, make the "Platform" column clickable — link to `/project/{slug}` (only if the project has a page). If no page exists, leave as plain text.
3. **Footer:** Do NOT add project links to footer (too many).

### Link FROM project pages to:
1. Asset cards link to `/{ticker}` hub pages
2. Product table rows link to `/vault/{slug}` vault pages
3. No external links

### Sitemap:
Add project pages to the sitemap in the Cloudflare Worker (files.earnbase.finance). Priority 0.8 (same as network filter pages). I will provide the updated Worker code separately.

### Add redirect for invalid slugs:
Add `/project/{invalid}` to the client-side redirect map — but only if a specific old URL gets indexed. For now, the validation in Task 1 (show 404 for unknown slugs) is sufficient.

**Test:** Visit a vault page on Morpho — "About Morpho" section should link to `/project/morpho`. Visit `/project/morpho` — table rows should link to individual vault pages.

---

## Final Page Layout

```
[Header / Nav]

H1: {Project} Yields — Compare APY Across {tickerCount} Assets
Intro: Earnbase tracks {strategyCount} strategies on {Project}...
Stats: {strategyCount} Strategies | {networkCount} Networks | {tickerCount} Assets

H2: Assets on {Project}
  [ticker cards with counts and top APY]

[Product Table — filterable, sortable]

H2: About {Project}
  [4-6 sentence description + tracking stat]

H2: Frequently Asked Questions
  [4 dynamic FAQ items with schema]

[Footer]
```

---

## Notes

- Project pages should follow the same design system as hub pages — same fonts, colors, table styles, card styles.
- All data is dynamic from the Index table. No hardcoded strategy counts.
- SEO meta tags (title, description, canonical, OG) must be set per page.
- The "About {Project}" descriptions ARE hardcoded text — see Part 2 document.

---

End of Part 1.