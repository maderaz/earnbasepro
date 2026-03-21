/**
 * TrendingProducts — Two side-by-side boxes on the homepage:
 *   Left:  "People Recently Viewed" — last 5 unique product views
 *   Right: "Most Popular in the Past 30 Days" — top 5 by views this month
 *
 * Data sourced from real page_views analytics via server endpoints.
 * Matches products[] to resolve names, APY, icons.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import type { DeFiProduct } from '@/app/utils/types';
import { getProductSlug } from '@/app/utils/slugify';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { formatTVL } from '@/app/utils/formatters';
import { Eye, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const FONT = "'Plus Jakarta Sans', sans-serif";
const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7b092b69`;

interface RecentProduct {
  slug: string;
  route: string;
  viewedAt: string;
}

interface PopularProduct {
  slug: string;
  route: string;
  views: number;
  uniqueVisitors: number;
}

interface Props {
  products: DeFiProduct[];
}

/** Build a slug → product lookup for fast matching */
function buildSlugMap(products: DeFiProduct[]): Map<string, DeFiProduct> {
  const map = new Map<string, DeFiProduct>();
  for (const p of products) {
    const slug = getProductSlug(p);
    if (slug) map.set(slug, p);
  }
  return map;
}

/** Relative time string — "2m ago", "3h ago", "1d ago" */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const TrendingProducts: React.FC<Props> = ({ products }) => {
  const { resolveAssetIcon, resolveNetworkIcon } = useRegistry();
  const [recentData, setRecentData] = useState<RecentProduct[]>([]);
  const [popularData, setPopularData] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const slugMap = useMemo(() => buildSlugMap(products), [products]);

  /** Deduplicate popular data: one product per ticker, resolved via slugMap, skip 0% APY */
  const popularDeduped = useMemo(() => {
    const seenTickers = new Set<string>();
    const result: PopularProduct[] = [];
    for (const item of popularData) {
      const product = slugMap.get(item.slug);
      if (!product || product.spotAPY <= 0) continue;
      const tk = product.ticker.toUpperCase();
      if (seenTickers.has(tk)) continue;
      seenTickers.add(tk);
      result.push(item);
      if (result.length >= 4) break;
    }
    return result;
  }, [popularData, slugMap]);

  /** Filter recent data: skip 0% APY, limit to 4 */
  const recentFiltered = useMemo(() => {
    const result: RecentProduct[] = [];
    for (const item of recentData) {
      const product = slugMap.get(item.slug);
      if (!product || product.spotAPY <= 0) continue;
      result.push(item);
      if (result.length >= 4) break;
    }
    return result;
  }, [recentData, slugMap]);

  useEffect(() => {
    const headers = {
      'Authorization': `Bearer ${publicAnonKey}`,
      'apikey': publicAnonKey,
    };

    Promise.all([
      fetch(`${BASE_URL}/pageviews/recent-products?limit=20`, { headers }).then(r => r.json()),
      fetch(`${BASE_URL}/pageviews/popular-products?limit=20`, { headers }).then(r => r.json()),
    ]).then(([recent, popular]) => {
      if (Array.isArray(recent)) setRecentData(recent);
      if (Array.isArray(popular)) setPopularData(popular);
    }).catch(err => {
      console.log('[TrendingProducts] fetch error:', err);
    }).finally(() => setLoading(false));
  }, []);

  // Don't render if no data at all
  if (!loading && recentFiltered.length === 0 && popularDeduped.length === 0) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ fontFamily: FONT }}>
      {/* ── Left: People Recently Viewed ── */}
      <div className="border border-[#e6e8ea] dark:border-border rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#f0f1f3] dark:border-border">
          <div className="w-7 h-7 rounded-lg bg-[#f0faf6] dark:bg-[#08a671]/10 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-[#08a671]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[#0e0f11] dark:text-foreground tracking-[-0.01em]">
            People Recently Viewed
          </h3>
        </div>
        <div className="divide-y divide-[#f5f6f7] dark:divide-border/50">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#f0f1f3] dark:bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 bg-[#f0f1f3] dark:bg-muted rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-[#f5f6f7] dark:bg-muted/50 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : recentFiltered.length === 0 ? (
            <div className="px-5 py-8 text-center text-[12px] text-[#aeb4bc] dark:text-muted-foreground">
              No product views recorded yet
            </div>
          ) : (
            recentFiltered.map((item, i) => {
              const product = slugMap.get(item.slug);
              if (!product || product.spotAPY <= 0) return null;
              const icon = resolveAssetIcon(product.ticker);
              const netIcon = resolveNetworkIcon(product.network);
              return (
                <Link
                  key={item.slug}
                  to={`/vault/${item.slug}`}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-[#fafbfc] dark:hover:bg-muted/30 transition-colors group"
                >
                  <div className="relative flex-shrink-0">
                    {icon ? (
                      <img src={icon} alt={product.ticker} className="w-7 h-7 rounded-full object-contain" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#f0f1f3] dark:bg-muted flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[#77808d] dark:text-muted-foreground">{product.ticker[0]}</span>
                      </div>
                    )}
                    {netIcon && (
                      <img
                        src={netIcon}
                        alt={product.network}
                        className="w-3.5 h-3.5 rounded-full absolute -bottom-0.5 -right-0.5 border border-white dark:border-card"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#0e0f11] dark:text-foreground truncate leading-tight">
                      {product.product_name}
                    </div>
                    <div className="text-[10px] text-[#99a0aa] dark:text-muted-foreground font-medium mt-0.5">
                      {product.platform_name} · {product.ticker}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-[12px] font-semibold text-[#08a671] tabular-nums">
                        {product.spotAPY.toFixed(2)}%
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#d0d5dd] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right: Most Popular in the Past 30 Days ── */}
      <div className="border border-[#e6e8ea] dark:border-border rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#f0f1f3] dark:border-border">
          <div className="w-7 h-7 rounded-lg bg-[#f0faf6] dark:bg-[#08a671]/10 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-[#08a671]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[#0e0f11] dark:text-foreground tracking-[-0.01em]">
            Most Popular in the Past 30 Days
          </h3>
        </div>
        <div className="divide-y divide-[#f5f6f7] dark:divide-border/50">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#f0f1f3] dark:bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 bg-[#f0f1f3] dark:bg-muted rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-[#f5f6f7] dark:bg-muted/50 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : popularDeduped.length === 0 ? (
            <div className="px-5 py-8 text-center text-[12px] text-[#aeb4bc] dark:text-muted-foreground">
              No product views this month yet
            </div>
          ) : (
            popularDeduped.map((item, i) => {
              const product = slugMap.get(item.slug);
              if (!product) return null;
              const icon = resolveAssetIcon(product.ticker);
              const netIcon = resolveNetworkIcon(product.network);
              return (
                <Link
                  key={item.slug}
                  to={`/vault/${item.slug}`}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-[#fafbfc] dark:hover:bg-muted/30 transition-colors group"
                >
                  {/* Rank badge */}
                  <div className="w-5 text-center flex-shrink-0">
                    <span className={`text-[11px] font-bold tabular-nums ${i === 0 ? 'text-[#08a671]' : 'text-[#c0c5cc] dark:text-muted-foreground/50'}`}>
                      {i + 1}
                    </span>
                  </div>
                  <div className="relative flex-shrink-0">
                    {icon ? (
                      <img src={icon} alt={product.ticker} className="w-7 h-7 rounded-full object-contain" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#f0f1f3] dark:bg-muted flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[#77808d] dark:text-muted-foreground">{product.ticker[0]}</span>
                      </div>
                    )}
                    {netIcon && (
                      <img
                        src={netIcon}
                        alt={product.network}
                        className="w-3.5 h-3.5 rounded-full absolute -bottom-0.5 -right-0.5 border border-white dark:border-card"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#0e0f11] dark:text-foreground truncate leading-tight">
                      {product.product_name}
                    </div>
                    <div className="text-[10px] text-[#99a0aa] dark:text-muted-foreground font-medium mt-0.5">
                      {product.platform_name} · {product.ticker}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-[12px] font-semibold text-[#08a671] tabular-nums">
                        {product.spotAPY.toFixed(2)}%
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#d0d5dd] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};