'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Monitor, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchPools } from '@/lib/api';
import { getProductSlug } from '@/lib/seo';
import type { DeFiProduct } from '@/lib/api';

const BASE = 'earnbase.finance';

// ── Mirrors vaultProductSEO title/description logic ──────────────────────────
const APY_THRESHOLDS: Record<string, number> = {
  USDC: 0.50, USDT: 0.50, EURC: 0.50, ETH: 1.00, WBTC: 0.25, CBBTC: 0.25,
};

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(1)}B`;
  if (tvl >= 1_000_000)     return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000)         return `$${(tvl / 1_000).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

const TITLE_LIMIT = 60;

function buildVaultSEO(p: DeFiProduct) {
  const T = p.ticker.toUpperCase();
  const threshold = APY_THRESHOLDS[T] ?? 0.50;
  const showAPY = p.spotAPY >= threshold;
  const apy = p.spotAPY.toFixed(2);
  const tvl = formatTVL(p.tvl);
  const slug = getProductSlug(p);

  // Mirror buildVaultTitle from seo.ts — same separator (' - ') and 60-char limit
  const fullName = p.product_name;
  const shortName = fullName.replace(/\s*\(.*?\)\s*/g, '').trim();
  let title: string;
  if (showAPY) {
    const candidates = [
      `${fullName} - ${apy}% APY | Earnbase`,
      `${shortName} - ${apy}% APY | Earnbase`,
      `${fullName} - ${apy}% APY`,
      `${shortName} - ${apy}% APY`,
    ];
    title = candidates.find(t => t.length <= TITLE_LIMIT) ?? candidates[candidates.length - 1];
  } else {
    const candidates = [`${fullName} | Earnbase`, `${shortName} | Earnbase`];
    title = candidates.find(t => t.length <= TITLE_LIMIT) ?? candidates[candidates.length - 1];
  }

  const description = showAPY
    ? `${p.product_name} on ${p.platform_name} generates ${apy}% on-chain APY on ${T} (${p.network}). TVL: ${tvl}. Yield data tracked daily on Earnbase.`
    : `${p.product_name} on ${p.platform_name}: ${T} yield strategy on ${p.network}. TVL: ${tvl}. Yield data tracked daily on Earnbase.`;

  const url = `${BASE}/vault/${slug}`;
  const breadcrumb = `${BASE} › vault › ${slug}`;

  const faq = [
    { q: `What is the current APY for ${p.product_name}?`, a: `The current spot APY is ${apy}%. The 30-day average APY is ${p.monthlyAPY.toFixed(2)}%.` },
    { q: `How much TVL is in ${p.product_name}?`, a: `TVL is ${tvl} in ${T} assets.` },
    { q: `Does ${p.product_name} yield include token rewards?`, a: `No. Earnbase tracks on-chain APY only — no token rewards, points, or incentives.` },
  ];

  return { title, description, url, breadcrumb, faq, showAPY };
}

// ── SEO Health Score ──────────────────────────────────────────────────────────
type SeoScore = {
  score: number;
  label: string;
  issues: string[];
  checks: { label: string; pass: boolean }[];
};

function computeSeoScore(p: DeFiProduct): SeoScore {
  const seo = buildVaultSEO(p);
  let score = 100;
  const issues: string[] = [];

  if (seo.title.length > 60) {
    score -= 20;
    issues.push(`Title too long (${seo.title.length}/60 chars)`);
  } else if (seo.title.length < 25) {
    score -= 10;
    issues.push(`Title too short (${seo.title.length} chars)`);
  }

  if (seo.description.length > 155) {
    score -= 20;
    issues.push(`Description too long (${seo.description.length}/155 chars)`);
  } else if (seo.description.length < 100) {
    score -= 10;
    issues.push(`Description too short (${seo.description.length} chars)`);
  }

  if (!seo.showAPY) {
    score -= 15;
    issues.push('APY below threshold \u2014 not shown in title');
  }

  if (p.spotAPY === 0) {
    score -= 5;
    issues.push('Spot APY is 0%');
  }

  const finalScore = Math.max(0, score);
  const label = finalScore >= 80 ? 'Good' : finalScore >= 60 ? 'Needs attention' : 'Poor';

  const checks = [
    { label: `Title \u2264 60 chars (${seo.title.length})`, pass: seo.title.length <= 60 },
    { label: 'Title \u2265 25 chars', pass: seo.title.length >= 25 },
    { label: `Description \u2264 155 chars (${seo.description.length})`, pass: seo.description.length <= 155 },
    { label: 'Description \u2265 100 chars', pass: seo.description.length >= 100 },
    { label: 'APY shown in title', pass: seo.showAPY },
    { label: 'Spot APY > 0%', pass: p.spotAPY > 0 },
  ];

  return { score: finalScore, label, issues, checks };
}

// ── Character count badge ─────────────────────────────────────────────────────
function CharBadge({ count, max, warn }: { count: number; max: number; warn: number }) {
  const ok = count <= max;
  const yellow = count > warn && count <= max;
  const red = count > max;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
      red    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
      yellow ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
               'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }`}>
      {red || yellow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
      {count}/{max}
    </span>
  );
}

// ── Score badge for product list ──────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : score >= 60
    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums shrink-0 ${color}`}>
      {score}
    </span>
  );
}

// ── SEO Health Card ───────────────────────────────────────────────────────────
function SeoHealthCard({ result }: { result: SeoScore }) {
  const { score, label, issues, checks } = result;
  const scoreColor = score >= 80
    ? 'text-green-600 dark:text-green-400'
    : score >= 60
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-red-600 dark:text-red-400';
  return (
    <div className="p-4 bg-muted/30 rounded-xl border border-border">
      <p className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-3">SEO Health</p>
      <div className="flex gap-6">
        <div className="shrink-0 flex flex-col items-center justify-center w-20">
          <span className={`text-4xl font-bold tabular-nums ${scoreColor}`}>{score}</span>
          <span className={`text-[11px] font-semibold mt-0.5 ${scoreColor}`}>{label}</span>
          {issues.length > 0 && (
            <span className="text-[10px] text-muted-foreground mt-1">
              {issues.length} issue{issues.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              {c.pass
                ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                : <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              <span className={`text-[12px] ${c.pass ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400 font-medium'}`}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Desktop SERP mockup ───────────────────────────────────────────────────────
function DesktopResult({ title, description, breadcrumb, faq }: {
  title: string; description: string; breadcrumb: string;
  faq: { q: string; a: string }[];
}) {
  const titleDisplay = title.length > 70 ? title.slice(0, 67) + '...' : title;
  const descDisplay  = description.length > 160 ? description.slice(0, 157) + '...' : description;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-[600px] font-sans">
      {/* Site info row */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">E</span>
        </div>
        <div>
          <p className="text-[13px] text-gray-800 leading-none">Earnbase</p>
          <p className="text-[12px] text-gray-500 leading-none mt-0.5 truncate max-w-[480px]">{breadcrumb}</p>
        </div>
      </div>
      {/* Title */}
      <h3 className="text-[20px] text-[#1a0dab] font-normal leading-snug hover:underline cursor-pointer mt-1">
        {titleDisplay}
      </h3>
      {/* Description */}
      <p className="text-[14px] text-gray-600 leading-snug mt-1">{descDisplay}</p>
      {/* FAQ snippet */}
      <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
        {faq.slice(0, 2).map((item, i) => (
          <details key={i} className="group">
            <summary className="text-[14px] text-[#1a0dab] cursor-pointer list-none flex items-center justify-between">
              {item.q}
              <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="text-[13px] text-gray-600 mt-1 pl-2">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Mobile SERP mockup ────────────────────────────────────────────────────────
function MobileResult({ title, description, breadcrumb, faq }: {
  title: string; description: string; breadcrumb: string;
  faq: { q: string; a: string }[];
}) {
  const titleDisplay = title.length > 65 ? title.slice(0, 62) + '...' : title;
  const descDisplay  = description.length > 130 ? description.slice(0, 127) + '...' : description;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 w-[360px] font-sans">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">E</span>
        </div>
        <div>
          <p className="text-[12px] text-gray-800 leading-none">Earnbase</p>
          <p className="text-[11px] text-gray-500 leading-none mt-0.5 truncate max-w-[300px]">{breadcrumb}</p>
        </div>
      </div>
      <h3 className="text-[18px] text-[#1a0dab] font-normal leading-snug mt-1">
        {titleDisplay}
      </h3>
      <p className="text-[13px] text-gray-600 leading-snug mt-1">{descDisplay}</p>
      <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
        {faq.slice(0, 2).map((item, i) => (
          <details key={i} className="group">
            <summary className="text-[13px] text-[#1a0dab] cursor-pointer list-none flex items-center justify-between">
              {item.q.length > 55 ? item.q.slice(0, 52) + '...' : item.q}
              <span className="text-gray-400 text-xs">▾</span>
            </summary>
            <p className="text-[12px] text-gray-600 mt-1 pl-2">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
export function SerpViewPanel() {
  const [products, setProducts] = useState<DeFiProduct[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DeFiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    fetchPools().then(({ products }) => {
      setProducts(products);
      if (products.length > 0) setSelected(products[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const base = !query
      ? products.slice(0, 80)
      : products.filter(p =>
          p.product_name.toLowerCase().includes(q) ||
          p.platform_name.toLowerCase().includes(q) ||
          p.ticker.toLowerCase().includes(q) ||
          p.network.toLowerCase().includes(q)
        ).slice(0, 80);
    if (!sortByScore) return base;
    return [...base].sort((a, b) => computeSeoScore(a).score - computeSeoScore(b).score);
  }, [products, query, sortByScore]);

  const seo = selected ? buildVaultSEO(selected) : null;
  const seoScore = selected ? computeSeoScore(selected) : null;

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[600px]">

      {/* ── Left: Product selector ── */}
      <div className="w-72 shrink-0 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-3 py-2 text-[13px] bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#08a671]"
          />
        </div>
        <button
          onClick={() => setSortByScore(v => !v)}
          className={`text-[11px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
            sortByScore
              ? 'bg-[#08a671]/10 border-[#08a671]/30 text-[#08a671]'
              : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          {sortByScore ? '↑ Worst score first' : 'Sort by SEO score'}
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {loading && <p className="text-[13px] text-muted-foreground p-2">Loading...</p>}
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-colors ${
                selected?.id === p.id
                  ? 'bg-[#08a671]/10 border border-[#08a671]/30 text-foreground'
                  : 'hover:bg-muted/60 text-muted-foreground border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="font-semibold text-foreground truncate flex-1">{p.product_name}</p>
                <ScoreBadge score={computeSeoScore(p).score} />
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{p.platform_name} · {p.ticker.toUpperCase()} · {p.network}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: SERP previews ── */}
      <div className="flex-1 overflow-y-auto space-y-8">
        {!seo && !loading && (
          <p className="text-muted-foreground text-sm mt-10 text-center">Select a product to preview</p>
        )}

        {seo && seoScore && (
          <>
            {/* SEO Health Score */}
            <SeoHealthCard result={seoScore} />

            {/* Character count indicators */}
            <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-xl border border-border text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Title</span>
                <CharBadge count={seo.title.length} max={60} warn={50} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Description</span>
                <CharBadge count={seo.description.length} max={155} warn={130} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">FAQ snippet</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" /> 3 Q&As
                </span>
              </div>
              {!seo.showAPY && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-yellow-600 dark:text-yellow-400 text-[12px]">APY below threshold — not shown in title</span>
                </div>
              )}
            </div>

            {/* Desktop */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-[13px] font-semibold text-foreground">Desktop</span>
                <span className="text-[11px] text-muted-foreground">~600px wide result card</span>
              </div>
              <DesktopResult
                title={seo.title}
                description={seo.description}
                breadcrumb={seo.breadcrumb}
                faq={seo.faq}
              />
            </div>

            {/* Mobile */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-[13px] font-semibold text-foreground">Mobile</span>
                <span className="text-[11px] text-muted-foreground">~360px wide result card</span>
              </div>
              <MobileResult
                title={seo.title}
                description={seo.description}
                breadcrumb={seo.breadcrumb}
                faq={seo.faq}
              />
            </div>

            {/* Raw values */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
              <p className="text-[12px] font-semibold text-foreground uppercase tracking-wider">Raw Values</p>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Title tag</p>
                <p className="text-[13px] text-foreground font-mono bg-background px-2 py-1 rounded">{seo.title}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Meta description</p>
                <p className="text-[13px] text-foreground font-mono bg-background px-2 py-1 rounded">{seo.description}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Canonical URL</p>
                <p className="text-[13px] text-[#08a671] font-mono bg-background px-2 py-1 rounded">https://{seo.url}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
