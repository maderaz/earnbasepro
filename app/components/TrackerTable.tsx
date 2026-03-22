'use client';

/**
 * TrackerTable — Interactive sortable/filterable yield strategy table.
 * Ported from src/app/components/TrackerTable.tsx — react-router replaced with next/navigation.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ArrowUpDown, X, ChevronUp, ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useRegistry } from '../hooks/useRegistry';
import { getProductSlug, slugify } from '@/app/utils/slugify';
import { formatTVL, formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';

interface TableProps {
  products: DeFiProduct[];
  loading?: boolean;
  allTickers?: string[];
}

export const TrackerTable: React.FC<TableProps> = ({ products, loading, allTickers = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ ticker?: string; network?: string }>();

  const { resolveAssetIcon, resolveNetworkIcon, matchesNetwork: checkNetworkMatch, getAllNetworks } = useRegistry();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [minTVL, setMinTVL] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState(100);
  const [sortConfig, setSortConfig] = useState<{ key: keyof DeFiProduct; direction: 'asc' | 'desc' } | null>(
    { key: 'spotAPY', direction: 'desc' }
  );
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.network) {
      setSelectedNetwork(params.network.toLowerCase());
    } else {
      setSelectedNetwork('all');
    }
  }, [params.network]);

  const networks = useMemo(() => {
    const allKnown = getAllNetworks();
    const productNets = new Set(products.map(p => (p.network || '').toLowerCase()));
    const matched = allKnown.filter(n =>
      [...productNets].some(net => checkNetworkMatch(net, n.id))
    );
    return [
      { id: 'all', name: 'All', icon: null as string | null },
      ...matched,
    ];
  }, [products, getAllNetworks, checkNetworkMatch]);

  const tickersToDisplay = allTickers.length > 0 ? allTickers : Array.from(new Set(products.map(p => p.ticker))).sort();
  const currentTicker = (params.ticker || '').toUpperCase() || 'USDC';
  const currentTickerIcon = resolveAssetIcon(currentTicker);

  const tvlFilters = [
    { id: 0, label: 'All TVL' },
    { id: 1000000, label: '>$1M' },
    { id: 10000000, label: '>$10M' },
    { id: 100000000, label: '>$100M' },
  ];

  const handleAssetChange = (newTicker: string) => {
    setIsAssetMenuOpen(false);
    const slug = slugify(newTicker);
    let newPath = `/${slug}`;
    if (params.network) newPath += `/${params.network}`;
    router.push(newPath);
  };

  const handleNetworkChange = (networkId: string) => {
    setSelectedNetwork(networkId);
    setIsNetworkMenuOpen(false);
    if (params.ticker) {
      const tickerSlug = slugify(params.ticker);
      if (networkId === 'all') {
        router.push(`/${tickerSlug}`);
      } else {
        router.push(`/${tickerSlug}/${networkId}`);
      }
    }
  };

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleSort = (key: keyof DeFiProduct) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedProducts = useMemo(() => [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = a[key] ?? 0;
    const bVal = b[key] ?? 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const strA = String(aVal).toLowerCase();
    const strB = String(bVal).toLowerCase();
    return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
  }), [products, sortConfig]);

  const filteredProducts = useMemo(() => sortedProducts.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      (p.platform_name?.toLowerCase() || '').includes(q) ||
      (p.product_name?.toLowerCase() || '').includes(q) ||
      (p.network?.toLowerCase() || '').includes(q) ||
      (p.ticker?.toLowerCase() || '').includes(q) ||
      (p.curator?.toLowerCase() || '').includes(q);
    const matchesNet = checkNetworkMatch(p.network, selectedNetwork);
    const matchesTvl = p.tvl >= minTVL;
    return matchesSearch && matchesNet && matchesTvl;
  }), [sortedProducts, searchTerm, selectedNetwork, minTVL, checkNetworkMatch]);

  // Reset pagination when filters change
  useEffect(() => { setDisplayCount(100); }, [searchTerm, selectedNetwork, minTVL]);

  const visibleProducts = filteredProducts.slice(0, displayCount);
  const hasMore = filteredProducts.length > displayCount;

  const showClearFilters = searchTerm !== '' || selectedNetwork !== 'all' || minTVL !== 0 ||
    pathname.split('/').filter(Boolean).length > 1;

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedNetwork('all');
    setMinTVL(0);
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1) router.push(`/${parts[0]}`);
  };

  return (
    <div className="relative w-full">
      {/* Desktop filters */}
      <div className="hidden lg:flex flex-wrap bg-card rounded-t-lg border border-border border-b-0 p-4 items-center gap-2">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border shrink-0">
          {networks.map(net => (
            <button
              key={net.id}
              disabled={loading}
              onClick={() => handleNetworkChange(net.id)}
              className={`flex items-center justify-center min-w-[48px] h-7 px-2 rounded-md transition-all duration-200 ${
                selectedNetwork === net.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/40 disabled:opacity-50'
              }`}
              title={net.name}
            >
              {net.icon ? (
                <img src={net.icon} alt={net.name} className="w-4 h-4 object-contain" />
              ) : (
                <span className="text-[11px] font-bold uppercase">{net.id === 'all' ? 'All' : net.name.slice(0, 3)}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border shrink-0">
          {tvlFilters.map(filter => (
            <button
              key={filter.id}
              disabled={loading}
              onClick={() => setMinTVL(filter.id)}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200 whitespace-nowrap ${
                minTVL === filter.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/40 disabled:opacity-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            disabled={loading}
            placeholder="Search assets, platforms..."
            className="w-full pl-11 pr-4 py-2.5 bg-muted/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#08a671]/10 focus:bg-card transition-all font-medium text-foreground border border-border/50 focus:border-border"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {showClearFilters && (
          <button
            onClick={handleClearFilters}
            className="whitespace-nowrap px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all flex items-center gap-2 group shrink-0"
          >
            <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg lg:rounded-t-none border border-border shadow-sm overflow-hidden w-full transition-colors duration-300">
        <div className="relative group/scroll">
          <div className="lg:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-20 flex items-center justify-end pr-1">
            <div className="w-1.5 h-12 bg-primary/20 rounded-full animate-pulse" />
          </div>
          <div className="w-full overflow-x-auto lg:overflow-hidden scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            <table className="w-full text-left border-collapse min-w-[500px] lg:min-w-0">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="hidden lg:table-cell pl-4 pr-1 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] w-[40px]">#</th>
                  <th
                    className="pl-4 lg:pl-3 pr-1 py-3 lg:py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors group/th"
                    onClick={() => !loading && handleSort('ticker')}
                  >
                    <div className="flex items-center gap-1.5">
                      Asset
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig?.key === 'ticker' ? 'opacity-100 text-[#08a671]' : 'opacity-0 group-hover/th:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-2 lg:px-3 py-3 lg:py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Product</th>
                  <th
                    className="px-1 lg:px-3 py-3 lg:py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors text-left lg:text-right group/th whitespace-nowrap"
                    onClick={() => !loading && handleSort('spotAPY')}
                  >
                    <div className="flex items-center lg:justify-end gap-1">
                      24H APY
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig?.key === 'spotAPY' ? 'opacity-100 text-[#08a671]' : 'opacity-0 group-hover/th:opacity-50'}`} />
                    </div>
                  </th>
                  <th
                    className="hidden xl:table-cell px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors text-right whitespace-nowrap group/th"
                    onClick={() => !loading && handleSort('monthlyAPY')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      30D APY
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig?.key === 'monthlyAPY' ? 'opacity-100 text-[#08a671]' : 'opacity-0 group-hover/th:opacity-50'}`} />
                    </div>
                  </th>
                  <th
                    className="px-2 lg:px-3 py-3 lg:py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors text-right group/th"
                    onClick={() => !loading && handleSort('tvl')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      TVL
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig?.key === 'tvl' ? 'opacity-100 text-[#08a671]' : 'opacity-0 group-hover/th:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="w-[32px] lg:w-[40px] pr-3 lg:pr-4 py-3 lg:py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="animate-pulse">
                      <td className="hidden lg:table-cell pl-4 py-4"><div className="h-3 w-4 bg-muted rounded" /></td>
                      <td className="px-3 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-muted" /><div className="h-3 w-10 bg-muted rounded" /></div></td>
                      <td className="px-3 py-4"><div className="space-y-1.5"><div className="h-3 w-24 bg-muted rounded" /><div className="h-2 w-16 bg-muted rounded" /></div></td>
                      <td className="px-3 py-4 text-right"><div className="h-4 w-14 bg-muted rounded ml-auto" /></td>
                      <td className="hidden xl:table-cell px-3 py-4 text-right"><div className="h-3 w-12 bg-muted rounded ml-auto" /></td>
                      <td className="px-3 py-4 text-right"><div className="h-3 w-14 bg-muted rounded ml-auto" /></td>
                      <td className="pr-3 lg:pr-4 py-4"><div className="h-4 w-4 bg-muted rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : visibleProducts.map((product, index) => {
                  const vaultUrl = `/vault/${getProductSlug(product)}`;
                  const assetIcon = resolveAssetIcon(product.ticker);
                  const networkIcon = resolveNetworkIcon(product.network);
                  return (
                    <tr
                      key={product.id}
                      onClick={() => router.push(vaultUrl)}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      role="link"
                      aria-label={`View ${product.product_name} on ${product.platform_name}`}
                    >
                      <td className="hidden lg:table-cell pl-4 py-3 align-middle text-[11px] font-normal text-muted-foreground/60 w-[40px]">
                        {index + 1}
                      </td>
                      <td className="pl-4 lg:pl-3 pr-1 py-3 align-middle">
                        <div className="flex items-center">
                          <div className="flex items-center shrink-0">
                            <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden shrink-0" title={product.network}>
                              {networkIcon ? (
                                <img src={networkIcon} alt={product.network} className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <span className="text-[7px] font-bold text-muted-foreground">{product.network?.[0]?.toUpperCase()}</span>
                              )}
                            </div>
                            <div className="w-7 h-7 flex items-center justify-center shrink-0 ml-1">
                              {assetIcon ? (
                                <img src={assetIcon} alt={product.ticker} className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-[9px] font-bold text-foreground">{product.ticker?.[0]?.toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="hidden lg:inline text-[13px] font-medium text-foreground ml-2">{product.ticker}</span>
                        </div>
                      </td>
                      <td className="px-2 lg:px-3 py-3 align-middle">
                        <Link
                          href={vaultUrl}
                          className="flex flex-col max-w-[120px] lg:max-w-none overflow-hidden"
                          onClick={e => e.stopPropagation()}
                          tabIndex={-1}
                        >
                          <span className="text-[13px] font-semibold text-foreground leading-tight truncate">
                            {product.product_name}
                            {product.curator && product.curator !== '-' && (
                              <span className="font-medium text-muted-foreground"> • {product.curator.replace(/\b\w/g, c => c.toUpperCase())}</span>
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate tracking-wide font-normal mt-0.5">
                            {product.platform_name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-1 lg:px-3 py-3 align-middle text-left lg:text-right whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-[#08a671]">
                          {formatAPY(product.spotAPY)}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell px-3 py-3 align-middle text-[12px] text-muted-foreground font-medium text-right whitespace-nowrap">
                        {formatAPY(product.monthlyAPY)}
                      </td>
                      <td className="px-2 lg:px-3 py-3 align-middle text-right whitespace-nowrap">
                        <span className="text-[12px] text-muted-foreground font-medium">
                          {formatTVL(product.tvl)}
                        </span>
                      </td>
                      <td className="pr-3 lg:pr-4 py-3 align-middle w-[32px] lg:w-[40px]">
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground transition-colors duration-150 inline-block ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Show more / pagination */}
      {hasMore && (
        <div className="flex items-center justify-center gap-4 py-5 border-t border-border/50">
          <span className="text-[12px] text-muted-foreground">
            Showing {displayCount} of {filteredProducts.length} strategies
          </span>
          <button
            onClick={() => setDisplayCount(c => c + 100)}
            className="px-5 py-2 text-[12px] font-semibold text-[#08a671] border border-[#08a671]/30 rounded-lg hover:bg-[#08a671]/5 transition-colors"
          >
            Show 100 more
          </button>
        </div>
      )}
      {!hasMore && filteredProducts.length > 100 && (
        <div className="text-center py-4 text-[12px] text-muted-foreground">
          All {filteredProducts.length} strategies shown
        </div>
      )}

      {/* Mobile sticky controls */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-[500px] mx-auto pointer-events-auto">
          <div className="relative flex items-center justify-between bg-[#111111] border border-white/10 rounded-xl px-2 py-2 shadow-2xl overflow-visible">

            {/* Asset selector */}
            <div className="relative flex-1">
              <button
                onClick={() => { setIsAssetMenuOpen(!isAssetMenuOpen); setIsNetworkMenuOpen(false); setIsSearchVisible(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-white"
              >
                <div className="w-6 h-6 shrink-0">
                  {currentTickerIcon ? (
                    <img src={currentTickerIcon} alt={currentTicker} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{currentTicker[0]}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{currentTicker}</span>
                <ChevronUp className={`w-3 h-3 opacity-50 transition-transform ${isAssetMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isAssetMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-3 w-48 bg-[#111111] border border-white/10 rounded-xl p-2 shadow-2xl z-50"
                  >
                    <div className="max-h-64 overflow-y-auto py-1 space-y-1">
                      {tickersToDisplay.map(ticker => {
                        const icon = resolveAssetIcon(ticker);
                        return (
                          <button
                            key={ticker}
                            onClick={() => handleAssetChange(ticker)}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                              currentTicker === ticker.toUpperCase() ? 'bg-[#08a671]/20 text-[#08a671]' : 'text-white/70 hover:bg-white/5'
                            }`}
                          >
                            {icon ? (
                              <img src={icon} alt={ticker} className="w-5 h-5 object-contain" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white">{ticker[0]}</span>
                              </div>
                            )}
                            <span className="text-xs font-bold uppercase tracking-wider">{ticker}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            {/* Network selector */}
            <div className="relative flex-1">
              <button
                onClick={() => { setIsNetworkMenuOpen(!isNetworkMenuOpen); setIsAssetMenuOpen(false); setIsSearchVisible(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded-md shrink-0">
                  {selectedNetwork === 'all' ? (
                    <Globe className="w-3.5 h-3.5" />
                  ) : (
                    (() => {
                      const net = networks.find(n => n.id === selectedNetwork);
                      return net?.icon
                        ? <img src={net.icon} alt={selectedNetwork} className="w-4 h-4 object-contain" />
                        : <Globe className="w-3.5 h-3.5" />;
                    })()
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest truncate">
                  {selectedNetwork === 'all' ? 'All' : networks.find(n => n.id === selectedNetwork)?.name ?? selectedNetwork}
                </span>
                <ChevronUp className={`w-3 h-3 opacity-50 transition-transform ${isNetworkMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isNetworkMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-3 w-48 bg-[#111111] border border-white/10 rounded-xl p-2 shadow-2xl z-50"
                  >
                    <div className="py-1 space-y-1">
                      {networks.map(net => (
                        <button
                          key={net.id}
                          onClick={() => handleNetworkChange(net.id)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                            selectedNetwork === net.id ? 'bg-[#08a671]/20 text-[#08a671]' : 'text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            {net.id === 'all' ? (
                              <Globe className="w-3.5 h-3.5" />
                            ) : net.icon ? (
                              <img src={net.icon} alt={net.name} className="w-4 h-4 object-contain" />
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider">{net.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search toggle */}
            <div className="relative">
              <button
                onClick={() => { setIsSearchVisible(!isSearchVisible); setIsAssetMenuOpen(false); setIsNetworkMenuOpen(false); }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isSearchVisible ? 'bg-[#08a671] text-white' : 'text-white/70 hover:bg-white/5'}`}
              >
                {isSearchVisible ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {isSearchVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, width: '100px' }}
                    animate={{ opacity: 1, y: 0, width: '280px' }}
                    exit={{ opacity: 0, y: 10, width: '100px' }}
                    className="absolute bottom-full right-0 mb-3 bg-[#111111] border border-white/10 rounded-xl p-3 shadow-2xl z-50 origin-bottom-right"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search vaults..."
                        className="w-full bg-white/5 border-none rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-[#08a671] placeholder-white/20 font-medium"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
