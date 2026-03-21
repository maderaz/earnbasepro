# Earnbase — Project Pages SEO (Titles, Descriptions, Schema)

## Instruction for Figma AI

Add SEO meta tags, Open Graph tags, and structured data to every `/project/{slug}` page. All values are dynamic — generated from the product data for that project.

---

## 1. Title Tag

**Template:**
```
{Project} Yields — Compare {strategyCount} Strategies | Earnbase
```

**Examples:**
- `Morpho Yields — Compare 103 Strategies | Earnbase`
- `Aave Yields — Compare 22 Strategies | Earnbase`
- `Wildcat Yields — Compare 5 Strategies | Earnbase`

**Implementation:**
```javascript
document.title = `${projectName} Yields — Compare ${strategyCount} Strategies | Earnbase`;
```

Or in `<head>`:
```html
<title>{Project} Yields — Compare {strategyCount} Strategies | Earnbase</title>
```

---

## 2. Meta Description

**Template:**
```
Compare {strategyCount} {Project} yield strategies across {tickerList}. Live APY rates, TVL, sustainability scores, and performance history — updated daily.
```

**Examples:**
- `Compare 103 Morpho yield strategies across USDC, ETH, USDT, WBTC, and cbBTC. Live APY rates, TVL, sustainability scores, and performance history — updated daily.`
- `Compare 22 Aave yield strategies across USDC, ETH, USDT, WBTC, and cbBTC. Live APY rates, TVL, sustainability scores, and performance history — updated daily.`
- `Compare 5 Wildcat yield strategies across USDC, ETH, and cbBTC. Live APY rates, TVL, sustainability scores, and performance history — updated daily.`

**Implementation:**
```html
<meta name="description" content="Compare {strategyCount} {Project} yield strategies across {tickerList}. Live APY rates, TVL, sustainability scores, and performance history — updated daily." />
```

**Data:**
```javascript
const tickers = [...new Set(projectProducts.map(p => p.ticker.toUpperCase()))];
const tickerList = tickers.length > 2
  ? tickers.slice(0, -1).join(', ') + ', and ' + tickers[tickers.length - 1]
  : tickers.join(' and ');
```

---

## 3. Canonical URL

```html
<link rel="canonical" href="https://earnbase.finance/project/{slug}" />
```

Always lowercase slug. No trailing slash.

---

## 4. Open Graph Tags

```html
<meta property="og:title" content="{Project} Yields — Compare {strategyCount} Strategies | Earnbase" />
<meta property="og:description" content="Compare {strategyCount} {Project} yield strategies across {tickerList}. Live APY rates, TVL, sustainability scores, and performance history — updated daily." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://earnbase.finance/project/{slug}" />
<meta property="og:site_name" content="Earnbase" />
```

OG image: use the same default Earnbase OG image used on hub pages. Do not generate a custom OG image per project page.

---

## 5. FAQ Schema (JSON-LD)

Add FAQ structured data with 4 dynamic questions. Same questions as Task 6 in the main spec, now wrapped in schema markup.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the highest APY on {Project}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The highest yield currently tracked on {Project} is {topAPY}% APY on {topProductName} ({topTicker} on {topNetwork}). Rates are variable and update daily."
      }
    },
    {
      "@type": "Question",
      "name": "How many strategies does Earnbase track on {Project}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Earnbase tracks {strategyCount} yield strategies on {Project} across {tickerCount} assets and {networkCount} networks."
      }
    },
    {
      "@type": "Question",
      "name": "What assets can I earn yield on with {Project}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{Project} supports yield strategies for {tickerList}. Each asset has multiple strategies with different risk profiles and APY rates."
      }
    },
    {
      "@type": "Question",
      "name": "Does {Project} yield include external rewards?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. APY shown on Earnbase reflects on-chain vault performance only. External incentives such as token rewards, points programs, and liquidity mining are excluded."
      }
    }
  ]
}
</script>
```

**Data for FAQ:**
```javascript
const topProduct = projectProducts.reduce((best, p) =>
  (p.spotAPY || 0) > (best.spotAPY || 0) ? p : best
, projectProducts[0]);

const topAPY = (topProduct.spotAPY || 0).toFixed(2);
const topProductName = topProduct.name;
const topTicker = topProduct.ticker.toUpperCase();
const topNetwork = topProduct.network;
const tickerCount = [...new Set(projectProducts.map(p => p.ticker))].length;
const networkCount = [...new Set(projectProducts.map(p => p.network))].length;
```

---

## 6. WebPage Schema (JSON-LD)

Add alongside the FAQ schema (both can exist on the same page):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{Project} Yields — Compare {strategyCount} Strategies",
  "description": "Compare {strategyCount} {Project} yield strategies across {tickerList}. Live APY rates, TVL, sustainability scores, and performance history — updated daily.",
  "url": "https://earnbase.finance/project/{slug}",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Earnbase",
    "url": "https://earnbase.finance"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Earnbase",
        "item": "https://earnbase.finance"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "{Project} Yields",
        "item": "https://earnbase.finance/project/{slug}"
      }
    ]
  }
}
</script>
```

---

## 7. Robots

Project pages should be indexable. Do NOT add `noindex`:

```html
<meta name="robots" content="index, follow" />
```

---

## Summary Checklist

For every `/project/{slug}` page, confirm:

- [ ] `<title>` follows template with dynamic strategy count
- [ ] `<meta name="description">` follows template with ticker list
- [ ] `<link rel="canonical">` points to correct URL
- [ ] OG tags match title and description
- [ ] FAQ schema has 4 questions with dynamic data
- [ ] WebPage schema with breadcrumb is present
- [ ] `<meta name="robots" content="index, follow" />`
- [ ] No hardcoded strategy counts or APY numbers in meta tags

---

End of SEO instruction.