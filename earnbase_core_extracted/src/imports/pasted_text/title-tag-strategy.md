# Earnbase - Title Tag Strategy (All Pages)

## Instruction for Figma AI

Replace all existing title tag logic with the patterns below. One consistent system across all page types.

---

## Global Rules

1. **Hard limit: 60 characters.** If the primary title exceeds 60 chars, use the fallback WITHOUT "| Earnbase". Brand suffix is the first thing to drop.
2. **Never truncate with "..."** - drop information instead.
3. **Separator: pipe `|`** everywhere.
4. **Dynamic counts `{N}`** must be computed from live data, not hardcoded.
5. **APY in vault titles** uses 24h APY. If APY is 0, null, or unavailable, skip APY entirely.

---

## Title Patterns

### Homepage `/`

```
Compare DeFi Yields Across Protocols | Earnbase
```

Hardcoded. 48 chars. No fallback needed.

---

### Asset Hub `/{ticker}`

```
f1: Compare {N} {T} Yield Strategies | Earnbase
f2: Compare {N} {T} Yield Strategies              ← drop brand if >60
```

Examples:
- `Compare 149 USDC Yield Strategies | Earnbase` (46 chars)
- `Compare 87 ETH Yield Strategies | Earnbase` (43 chars)
- `Compare 22 cbBTC Yield Strategies | Earnbase` (46 chars)

---

### Network Filter `/{ticker}/{network}`

```
f1: Compare {N} {T} Yields on {Network} | Earnbase
f2: Compare {N} {T} Yields on {Network}           ← drop brand if >60
```

Examples:
- `Compare 62 USDC Yields on Mainnet | Earnbase` (46 chars)
- `Compare 34 ETH Yields on Base | Earnbase` (41 chars)
- `Compare 7 USDC Yields on Avalanche | Earnbase` (47 chars)

---

### Vault Product `/vault/{slug}`

```
f1: {fullName} - {apy}% APY | Earnbase
f2: {shortName} - {apy}% APY | Earnbase           ← shorter name if >60
f3: {fullName} - {apy}% APY                        ← drop brand, keep APY
f4: {shortName} - {apy}% APY                       ← shorter name + no brand
f5: {fullName} | Earnbase                          ← no APY fallback
```

APY is the click magnet - drop brand before APY.

Examples:
- `USDC Prime (Gauntlet) - 2.91% APY | Earnbase` (47 chars)
- `Wintermute Trading (Private Credit) - 10.00% APY | Earnbase` (60 chars)
- `InfiniFi Pointsmaxx Silo IPOR Fusion - 8.50% APY` (50 chars) ← brand dropped
- `wsrUSD Leveraged Looping - 15.97% APY | Earnbase` (49 chars)

If APY is 0, null, or undefined: skip f1-f4, use `{fullName} | Earnbase` or `{shortName} | Earnbase`.

---

### Project Page `/project/{slug}`

```
f1: Compare {N} Yield Strategies on {Project} | Earnbase
f2: Compare {N} Yield Strategies on {Project}     ← drop brand if >60
```

Examples:
- `Compare 103 Yield Strategies on Morpho | Earnbase` (50 chars)
- `Compare 22 Yield Strategies on Aave | Earnbase` (47 chars)
- `Compare 20 Yield Strategies on IPOR Fusion | Earnbase` (54 chars)

---

### Curator Page `/curator/{slug}`

```
f1: Compare {N} Strategies Curated by {Curator} | Earnbase
f2: Compare {N} Strategies Curated by {Curator}   ← drop brand if >60
```

Examples:
- `Compare 36 Strategies Curated by Gauntlet | Earnbase` (53 chars)
- `Compare 17 Strategies Curated by Steakhouse | Earnbase` (55 chars)
- `Compare 7 Strategies Curated by MEV Capital | Earnbase` (55 chars)

---

### About Page `/about`

```
About Earnbase - DeFi Yield Data Aggregator
```

Hardcoded. 44 chars. No fallback needed.

---

## Implementation

Single function that applies the fallback logic:

```javascript
function buildTitle(primary, withoutBrand) {
  if (primary.length <= 60) return primary;
  if (withoutBrand && withoutBrand.length <= 60) return withoutBrand;
  return primary.slice(0, 60); // absolute last resort, should never happen
}
```

For vault pages with multiple fallbacks:

```javascript
function buildVaultTitle(fullName, shortName, apy) {
  const candidates = [];
  
  if (apy && apy > 0) {
    candidates.push(`${fullName} - ${apy}% APY | Earnbase`);
    candidates.push(`${shortName} - ${apy}% APY | Earnbase`);
    candidates.push(`${fullName} - ${apy}% APY`);
    candidates.push(`${shortName} - ${apy}% APY`);
  }
  
  candidates.push(`${fullName} | Earnbase`);
  candidates.push(`${shortName} | Earnbase`);
  
  return candidates.find(t => t.length <= 60) || candidates[candidates.length - 1];
}
```

---

## Do NOT Change

- Meta descriptions (separate logic, not affected)
- OG titles (should mirror the `<title>` tag)
- JSON-LD schema names (should mirror the `<title>` tag)

---

End of document.