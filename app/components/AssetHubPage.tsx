'use client';
/**
 * AssetHubPage — Interactive asset hub page (port of src/app/components/AssetPageV2.tsx)
 * Handles /[ticker] routes with filtering, sorting, and mobile bar.
 */
import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronRight, ChevronUp, Globe, X,
} from 'lucide-react';
import { useRegistry } from '@/app/hooks/useRegistry';
import { getProductSlug, slugify } from '@/app/utils/slugify';
import { formatTVL, formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';

// ── Sort Icon ─────────────────────────────────────────────────
type SortKey = keyof DeFiProduct;
const SortIcon: React.FC<{
  col: SortKey;
  sortConfig: { key: SortKey; direction: 'asc' | 'desc' } | null;
}> = ({ col, sortConfig }) => {
  const active = sortConfig?.key === col;
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-30 transition-opacity" />;
  return sortConfig.direction === 'desc'
    ? <ArrowDown className="w-3 h-3 text-[#08a671]" />
    : <ArrowUp className="w-3 h-3 text-[#08a671]" />;
};

// ── Props ─────────────────────────────────────────────────────
interface Props {
  ticker: string;
  products: DeFiProduct[];
  allTickers: string[];
}

export const AssetHubPage: React.FC<Props> = ({ ticker, products, allTickers }) => {
  const router = useRouter();
  const { resolveAssetIcon, resolveNetworkIcon, resolveNetworkName, matchesNetwork: checkNetworkMatch, getAllNetworks } = useRegistry();

  const TICKER = ticker.toUpperCase();

  const tickerProducts = useMemo(
    () => products.filter(p => (p.ticker || '').toUpperCase() === TICKER),
    [products, TICKER],
  );

  // ── State ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [minTVL, setMinTVL] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(
    { key: 'spotAPY', direction: 'desc' },
  );
  const searchRef = useRef<HTMLInputElement>(null);

  // Mobile bottom bar state
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  const [isTvlMenuOpen, setIsTvlMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false);

  const ASSET_OPTIONS = useMemo(() => {
    return allTickers.slice(0, 8).map(t => ({
      ticker: t,
      slug: slugify(t),
      icon: resolveAssetIcon(t),
    }));
  }, [resolveAssetIcon, allTickers]);

  const networks = useMemo(() => {
    const allKnown = getAllNetworks();
    const productNets = new Set(tickerProducts.map(p => (p.network || '').toLowerCase()));
    const matched = allKnown.filter(n => [...productNets].some(net => checkNetworkMatch(net, n.id)));
    return [{ id: 'all', name: 'All Networks', icon: null as string | null }, ...matched];
  }, [tickerProducts, getAllNetworks, checkNetworkMatch]);

  const tvlFilters = [
    { id: 0, label: 'All TVL' },
    { id: 1_000_000, label: '$1M+' },
    { id: 10_000_000, label: '$10M+' },
    { id: 100_000_000, label: '$100M+' },
  ];

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'desc') return { key, direction: 'asc' };
        return null;
      }
      return { key, direction: 'desc' };
    });
  };

  const sorted = useMemo(() => {
    const arr = [...tickerProducts];
    if (!sortConfig) return arr;
    const { key, direction } = sortConfig;
    return arr.sort((a, b) => {
      const aVal = (a as any)[key] ?? 0;
      const bVal = (b as any)[key] ?? 0;
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      const sa = String(aVal).toLowerCase();
      const sb = String(bVal).toLowerCase();
      return direction === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [tickerProducts, sortConfig]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return sorted.filter(p => {
      const matchSearch = !q ||
        (p.platform_name || '').toLowerCase().includes(q) ||
        (p.product_name || '').toLowerCase().includes(q) ||
        (p.network || '').toLowerCase().includes(q) ||
        (p.curator || '').toLowerCase().includes(q);
      const matchNet = checkNetworkMatch(p.network, selectedNetwork);
      const matchTVL = p.tvl >= minTVL;
      return matchSearch && matchNet && matchTVL;
    });
  }, [sorted, searchTerm, selectedNetwork, minTVL, checkNetworkMatch]);

  const stats = useMemo(() => ({
    count: tickerProducts.length,
    networkCount: new Set(tickerProducts.map(p => (p.network || '').toLowerCase())).size,
  }), [tickerProducts]);

  const activeFilters = searchTerm !== '' || selectedNetwork !== 'all' || minTVL > 0;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedNetwork('all');
    setMinTVL(0);
  };

  const otherTickers = useMemo(
    () => allTickers.filter(t => t.toLowerCase() !== ticker.toLowerCase()).slice(0, 5),
    [allTickers, ticker],
  );

  const closeAllMenus = () => {
    setIsAssetMenuOpen(false);
    setIsNetworkMenuOpen(false);
    setIsTvlMenuOpen(false);
    setIsSearchVisible(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="space-y-2">
        <h1 className="text-[17px] font-medium text-[#141414] dark:text-foreground leading-tight w-full">
          Best <span className="text-[#08a671]">{TICKER}</span> APY | Track &amp; Compare On-Chain Yield
        </h1>
        <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed w-full">
          Tracking <span className="font-medium text-[#08a671]">{stats.count}</span> {TICKER} yield
          strategies across {stats.networkCount} network{stats.networkCount === 1 ? '' : 's'}. On-chain APY and TVL data, updated daily.
        </p>
      </header>

      {/* ── Desktop Filters ──────────────────────────────── */}
      <div className="hidden lg:flex flex-wrap items-center gap-2">
        {/* Network pills */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border shrink-0">
          {networks.map(net => (
            <button
              key={net.id}
              onClick={() => setSelectedNetwork(net.id)}
              className={`flex items-center justify-center min-w-[48px] h-7 px-2 rounded-md transition-all duration-200 cursor-pointer ${
                selectedNetwork === net.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
              }`}
              title={net.name}
            >
              {net.icon ? (
                <img src={net.icon} alt={net.name} className="w-4 h-4 object-contain" />
              ) : (
                <span className="text-[11px] font-bold uppercase">All</span>
              )}
            </button>
          ))}
        </div>

        {/* TVL filter */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border shrink-0">
          {tvlFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setMinTVL(f.id)}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer ${
                minTVL === f.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search assets, platforms..."
            className="w-full pl-11 pr-4 py-2.5 bg-muted/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#08a671]/10 focus:bg-card transition-all font-medium text-foreground border border-border/50 focus:border-border"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {activeFilters && (
          <button
            onClick={clearFilters}
            className="whitespace-nowrap px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all flex items-center gap-2 group shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            Clear Filters
          </button>
        )}
      </div>

      {/* ── Table Card ────────────────────────────────────── */}
      <div className="-mx-5 sm:mx-0 bg-card sm:rounded-lg border border-border overflow-hidden transition-colors duration-300 lg:mb-0 mb-20">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50">
                <th className="hidden md:table-cell pl-5 pr-1 py-3 text-[11px] font-medium text-muted-foreground/50 w-[44px]">#</th>
                <th className="pl-4 md:pl-3 pr-2 py-3 text-[11px] font-medium text-muted-foreground/50 cursor-pointer group/th" onClick={() => handleSort('product_name')}>
                  <span className="inline-flex items-center gap-1">Product <SortIcon col="product_name" sortConfig={sortConfig} /></span>
                </th>
                <th className="pl-1 pr-3 py-3 text-[11px] font-medium text-muted-foreground/50 text-right cursor-pointer group/th whitespace-nowrap w-[80px] sm:w-[90px]" onClick={() => handleSort('spotAPY')}>
                  <span className="inline-flex items-center justify-end gap-1 w-full">APY <span className="hidden sm:inline">24h</span> <SortIcon col="spotAPY" sortConfig={sortConfig} /></span>
                </th>
                <th className="hidden xl:table-cell px-4 py-3 text-[11px] font-medium text-muted-foreground/70 text-right cursor-pointer group/th whitespace-nowrap" onClick={() => handleSort('monthlyAPY')}>
                  <span className="inline-flex items-center justify-end gap-1 w-full">APY 30d <SortIcon col="monthlyAPY" sortConfig={sortConfig} /></span>
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-[11px] font-medium text-muted-foreground/70 text-right cursor-pointer group/th" onClick={() => handleSort('tvl')}>
                  <span className="inline-flex items-center justify-end gap-1 w-full">TVL <SortIcon col="tvl" sortConfig={sortConfig} /></span>
                </th>
                <th className="hidden md:table-cell px-2 py-3 text-[11px] font-medium text-muted-foreground/50 text-center w-[44px]" />
                <th className="hidden lg:table-cell py-3 pr-5 w-[110px]" />
                <th className="lg:hidden w-6 pr-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => {
                const vaultUrl = `/vault/${getProductSlug(product)}`;
                const curatorDisplay = product.curator && product.curator !== '-' ? product.curator : null;
                return (
                  <tr
                    key={product.id}
                    onClick={() => router.push(vaultUrl)}
                    className="border-b border-border/30 last:border-b-0 hover:bg-[#f8fafb] dark:hover:bg-muted/10 transition-colors cursor-pointer group"
                    role="link"
                  >
                    <td className="hidden md:table-cell pl-5 pr-1 py-3 align-middle text-[12px] text-muted-foreground/35 font-normal tabular-nums">{idx + 1}</td>
                    <td className="pl-4 md:pl-3 pr-2 py-3 align-middle max-w-0 sm:max-w-none">
                      <Link href={vaultUrl} className="flex items-center gap-2 sm:gap-2.5 min-w-0" onClick={e => e.stopPropagation()} tabIndex={-1}>
                        <div className="relative shrink-0">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex items-center justify-center">
                            {resolveAssetIcon(product.ticker) ? (
                              <img src={resolveAssetIcon(product.ticker)!} alt={product.ticker} className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                            ) : (
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-[8px] sm:text-[9px] font-bold">{product.ticker[0]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <span className="text-[12px] sm:text-[13px] font-medium text-foreground leading-tight truncate block">{product.product_name}</span>
                          <span className="text-[10px] sm:text-[11px] text-muted-foreground/65 font-normal truncate block mt-px">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3.5 h-3.5 rounded-full border border-border/60 flex items-center justify-center shrink-0 md:hidden">
                                <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-2.5 h-2.5 object-contain" />
                              </span>
                              {product.platform_name}{curatorDisplay ? ` · ${curatorDisplay}` : null}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="pl-1 pr-3 py-3 align-middle text-right">
                      <span className="text-[13px] font-semibold text-[#08a671] tabular-nums">{formatAPY(product.spotAPY)}</span>
                    </td>
                    <td className="hidden xl:table-cell px-4 py-3 align-middle text-right">
                      <span className="text-[12px] text-muted-foreground/80 font-medium tabular-nums">{formatAPY(product.monthlyAPY)}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 align-middle text-right">
                      <span className="text-[12px] text-muted-foreground/80 font-medium tabular-nums">{formatTVL(product.tvl)}</span>
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 align-middle w-[44px]">
                      <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 mx-auto">
                        <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-full h-full object-contain" />
                      </div>
                    </td>
                    <td className="hidden lg:table-cell py-3 pr-5 align-middle">
                      <Link
                        href={vaultUrl}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md text-[12px] font-medium text-foreground/70 bg-muted/60 border border-border/50 hover:bg-[#08a671] hover:text-white hover:border-[#08a671] transition-all duration-200"
                        onClick={e => e.stopPropagation()}
                        tabIndex={-1}
                      >
                        Explore <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="lg:hidden pr-3 py-3 align-middle">
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/15 group-hover:text-muted-foreground/40 transition-colors ml-auto" />
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-20">
                    <div className="space-y-2">
                      <Search className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                      <p className="text-[13px] font-medium text-foreground">No strategies found</p>
                      <p className="text-[12px] text-muted-foreground/50">Adjust your filters or search query.</p>
                      {activeFilters && (
                        <button onClick={clearFilters} className="text-[12px] font-medium text-[#08a671] hover:underline cursor-pointer mt-1">
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Cross-links ────────────────────────────────────── */}
      {otherTickers.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mr-1">
            Explore other assets
          </span>
          {otherTickers.map(t => (
            <Link
              key={t}
              href={`/${slugify(t)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:border-[#08a671]/30 hover:text-foreground transition-all"
            >
              {t} Yields
            </Link>
          ))}
        </div>
      )}

      {/* ── Mobile Sticky Bottom Bar ──────────────────────── */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-[500px] mx-auto pointer-events-auto">
          <div className="relative flex items-center justify-between bg-[#111111] border border-white/10 rounded-xl px-2 py-2 shadow-2xl overflow-visible">

            {/* Asset Selector */}
            <div className="relative">
              <button
                onClick={() => { setIsAssetMenuOpen(!isAssetMenuOpen); setIsNetworkMenuOpen(false); setIsTvlMenuOpen(false); setIsSearchVisible(false); }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-white"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                  {resolveAssetIcon(TICKER) ? (
                    <img src={resolveAssetIcon(TICKER)!} alt={TICKER} className="w-5 h-5 object-contain" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[8px] font-bold">{TICKER[0]}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{TICKER}</span>
                <ChevronUp className={`w-3 h-3 opacity-50 transition-transform ${isAssetMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAssetMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-44 bg-[#111111] border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                  <div className="py-1 space-y-1">
                    {ASSET_OPTIONS.map(opt => (
                      <button
                        key={opt.ticker}
                        onClick={() => { closeAllMenus(); if (opt.ticker.toUpperCase() !== TICKER) router.push(`/${opt.slug}`); }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors text-left ${opt.ticker.toUpperCase() === TICKER ? 'bg-[#08a671]/20 text-[#08a671]' : 'text-white/70 hover:bg-white/5'}`}
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                          {opt.icon ? <img src={opt.icon} alt={opt.ticker} className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><span className="text-[8px] font-bold">{opt.ticker[0]}</span></div>}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{opt.ticker}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            {/* Network Selector */}
            <div className="relative flex-1">
              <button
                onClick={() => { setIsNetworkMenuOpen(!isNetworkMenuOpen); setIsTvlMenuOpen(false); setIsSearchVisible(false); setIsAssetMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded-md shrink-0">
                  {selectedNetwork === 'all' ? <Globe className="w-3.5 h-3.5" /> : <img src={networks.find(n => n.id === selectedNetwork)?.icon || ''} alt={selectedNetwork} className="w-4 h-4 object-contain" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest truncate">
                  {selectedNetwork === 'all' ? 'All' : (networks.find(n => n.id === selectedNetwork)?.name || selectedNetwork)}
                </span>
                <ChevronUp className={`w-3 h-3 opacity-50 transition-transform ${isNetworkMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isNetworkMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-52 bg-[#111111] border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                  <div className="py-1 space-y-1 max-h-[280px] overflow-y-auto">
                    {networks.map(net => (
                      <button
                        key={net.id}
                        onClick={() => { setSelectedNetwork(net.id); setIsNetworkMenuOpen(false); }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors text-left ${selectedNetwork === net.id ? 'bg-[#08a671]/20 text-[#08a671]' : 'text-white/70 hover:bg-white/5'}`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {net.icon ? <img src={net.icon} alt={net.name} className="w-4 h-4 object-contain" /> : <Globe className="w-3.5 h-3.5 opacity-50" />}
                        </div>
                        <span className="text-xs font-medium">{net.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            {/* TVL Filter */}
            <div className="relative">
              <button
                onClick={() => { setIsTvlMenuOpen(!isTvlMenuOpen); setIsNetworkMenuOpen(false); setIsSearchVisible(false); setIsAssetMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-white"
              >
                <span className="text-xs font-bold tracking-wide">{tvlFilters.find(f => f.id === minTVL)?.label || 'TVL'}</span>
                <ChevronUp className={`w-3 h-3 opacity-50 transition-transform ${isTvlMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTvlMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-36 bg-[#111111] border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                  <div className="py-1 space-y-1">
                    {tvlFilters.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { setMinTVL(f.id); setIsTvlMenuOpen(false); }}
                        className={`flex items-center w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${minTVL === f.id ? 'bg-[#08a671]/20 text-[#08a671]' : 'text-white/70 hover:bg-white/5'}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            {/* Search toggle */}
            <button
              onClick={() => { setIsSearchVisible(!isSearchVisible); setIsNetworkMenuOpen(false); setIsTvlMenuOpen(false); setIsAssetMenuOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-white"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Search Input */}
          {isSearchVisible && (
            <div className="mt-2 bg-[#111111] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
              <input
                autoFocus
                type="text"
                placeholder="Search assets, platforms..."
                className="w-full bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
