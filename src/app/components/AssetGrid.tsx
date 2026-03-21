import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { DeFiProduct } from '@/app/utils/types';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { slugify } from '@/app/utils/slugify';
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface AssetGridProps {
  products: DeFiProduct[];
  loading?: boolean;
}

type AssetRow = {
  ticker: string;
  count: number;
  networks: Set<string>;
  protocols: Set<string>;
  maxApy: number;
};

type SortKey = 'ticker' | 'count' | 'networks' | 'protocols' | 'maxApy';

export const AssetGrid: React.FC<AssetGridProps> = ({ products, loading = false }) => {
  const navigate = useNavigate();
  const { resolveAssetIcon } = useRegistry();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(
    { key: 'count', direction: 'desc' },
  );

  // Group products by ticker
  const grouped = products.reduce((acc, p) => {
    if (!p) return acc;
    const t = (p.ticker || 'N/A').toUpperCase();
    if (!acc[t]) {
      acc[t] = { ticker: t, count: 0, networks: new Set(), protocols: new Set(), maxApy: 0 };
    }
    acc[t].count++;
    if (p.network) acc[t].networks.add(p.network);
    acc[t].protocols.add(p.platform_name || 'Unknown');
    if (p.spotAPY > acc[t].maxApy) acc[t].maxApy = p.spotAPY;
    return acc;
  }, {} as Record<string, AssetRow>);

  const assets = Object.values(grouped);

  // Sorting
  const sorted = [...assets].sort((a, b) => {
    if (!sortConfig) return b.count - a.count;
    const { key, direction } = sortConfig;
    const mul = direction === 'desc' ? -1 : 1;
    if (key === 'ticker') return mul * a.ticker.localeCompare(b.ticker);
    if (key === 'networks') return mul * (a.networks.size - b.networks.size);
    if (key === 'protocols') return mul * (a.protocols.size - b.protocols.size);
    if (key === 'maxApy') return mul * (a.maxApy - b.maxApy);
    return mul * (a.count - b.count);
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev?.key === key) return { key, direction: prev.direction === 'desc' ? 'asc' : 'desc' };
      return { key, direction: 'desc' };
    });
  };

  const SortIcon: React.FC<{ col: SortKey }> = ({ col }) => {
    const active = sortConfig?.key === col;
    if (!active) return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-30 transition-opacity" />;
    return sortConfig.direction === 'desc'
      ? <ArrowDown className="w-3 h-3 text-[#08a671]" />
      : <ArrowUp className="w-3 h-3 text-[#08a671]" />;
  };

  const thBase = "py-3 lg:py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors group/th";

  /* ── Skeleton ─────────────────────────────────────────────── */
  if (loading && assets.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[520px] lg:min-w-0">
            <thead>
              <tr className="border-b border-border">
                <th className="hidden lg:table-cell pl-4 pr-1 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] w-[40px]">#</th>
                <th className="pl-4 lg:pl-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Asset</th>
                <th className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-right">Strategies</th>
                <th className="hidden sm:table-cell px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-right">Networks</th>
                <th className="hidden md:table-cell px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-right">Protocols</th>
                <th className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-right">Highest APY</th>
                <th className="w-[40px] pr-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="hidden lg:table-cell pl-4 py-4"><div className="h-3 w-4 bg-muted rounded" /></td>
                  <td className="pl-4 lg:pl-3 py-4"><div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-muted" /><div className="h-4 w-14 bg-muted rounded" /></div></td>
                  <td className="px-3 py-4 text-right"><div className="h-4 w-6 bg-muted rounded ml-auto" /></td>
                  <td className="hidden sm:table-cell px-3 py-4 text-right"><div className="h-4 w-6 bg-muted rounded ml-auto" /></td>
                  <td className="hidden md:table-cell px-3 py-4 text-right"><div className="h-4 w-6 bg-muted rounded ml-auto" /></td>
                  <td className="px-3 py-4 text-right"><div className="h-4 w-12 bg-muted rounded ml-auto" /></td>
                  <td className="pr-4 py-4"><div className="h-4 w-4 bg-muted rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ── Table ────────────────────────────────────────────────── */
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[520px] lg:min-w-0">
          <thead>
            <tr className="border-b border-border">
              {/* # */}
              <th className="hidden lg:table-cell pl-4 pr-1 py-3 lg:py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] w-[40px]">#</th>

              {/* Asset */}
              <th
                className={`pl-4 lg:pl-3 pr-1 ${thBase}`}
                onClick={() => handleSort('ticker')}
              >
                <div className="flex items-center gap-1.5">
                  Asset <SortIcon col="ticker" />
                </div>
              </th>

              {/* Strategies */}
              <th
                className={`px-3 ${thBase} text-right`}
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center justify-end gap-1">
                  Strategies <SortIcon col="count" />
                </div>
              </th>

              {/* Networks — hidden on xs */}
              <th
                className={`hidden sm:table-cell px-3 ${thBase} text-right`}
                onClick={() => handleSort('networks')}
              >
                <div className="flex items-center justify-end gap-1">
                  Networks <SortIcon col="networks" />
                </div>
              </th>

              {/* Protocols — hidden on xs/sm */}
              <th
                className={`hidden md:table-cell px-3 ${thBase} text-right`}
                onClick={() => handleSort('protocols')}
              >
                <div className="flex items-center justify-end gap-1">
                  Protocols <SortIcon col="protocols" />
                </div>
              </th>

              {/* Highest APY */}
              <th
                className={`px-3 ${thBase} text-right`}
                onClick={() => handleSort('maxApy')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Highest APY</span> <SortIcon col="maxApy" />
                </div>
              </th>

              {/* CTA arrow */}
              <th className="w-[40px] pr-4 py-3 lg:py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sorted.map((asset, idx) => {
              const icon = resolveAssetIcon(asset.ticker);
              return (
                <tr
                  key={asset.ticker}
                  className="group/row hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => navigate(`/${slugify(asset.ticker)}`)}
                >
                  {/* # */}
                  <td className="hidden lg:table-cell pl-4 py-3 align-middle text-[11px] font-normal text-muted-foreground/60 w-[40px]">
                    {idx + 1}
                  </td>

                  {/* Asset */}
                  <td className="pl-4 lg:pl-3 pr-1 py-3 align-middle">
                    <Link
                      to={`/${slugify(asset.ticker)}`}
                      className="flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        {icon ? (
                          <img src={icon} alt={asset.ticker} className="w-7 h-7 object-contain" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center border border-border">
                            <span className="text-xs font-semibold text-foreground">{asset.ticker[0]}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[13px] font-semibold text-foreground">{asset.ticker}</span>
                    </Link>
                  </td>

                  {/* Strategies */}
                  <td className="px-3 py-3 align-middle text-right">
                    <span className="text-[12px] font-medium text-foreground">{asset.count}</span>
                  </td>

                  {/* Networks */}
                  <td className="hidden sm:table-cell px-3 py-3 align-middle text-right">
                    <span className="text-[12px] font-medium text-muted-foreground">{asset.networks.size}</span>
                  </td>

                  {/* Protocols */}
                  <td className="hidden md:table-cell px-3 py-3 align-middle text-right">
                    <span className="text-[12px] font-medium text-muted-foreground">{asset.protocols.size}</span>
                  </td>

                  {/* Highest APY */}
                  <td className="px-3 py-3 align-middle text-right">
                    <span className="text-[12px] font-semibold text-[#08a671]">{asset.maxApy.toFixed(2)}%</span>
                  </td>

                  {/* Explore CTA */}
                  <td className="pr-4 py-3 align-middle">
                    <Link
                      to={`/${slugify(asset.ticker)}`}
                      className="ml-auto flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground/40 group-hover/row:text-[#08a671] transition-colors"
                      aria-label={`Explore ${asset.ticker} yields`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};