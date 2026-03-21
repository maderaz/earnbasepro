import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, Shield, Link as LinkIcon, Info, ListFilter, Clock, CheckCircle2, Globe, Trash2, X, ChevronDown, ChevronUp, ChevronRight, AlertTriangle, RefreshCw, ArrowUpDown, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from "sonner";
import { generateVaultSlug } from '@/app/utils/slugify';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { ComboInput } from './ui/ComboInput';
import { formatAPY, formatTVL } from '@/app/utils/formatters';
import * as api from '@/app/utils/api';

interface PendingProduct {
  id: number;
  ticker: string;
  network: string;
  platform: string;
  productName: string;
  curator?: string;
  defillamaId?: string;
  defillamaID?: string;
  defillama_id?: string;
  created_at?: string;
  url?: string;
  vault_address?: string;
}

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { resolveAssetIcon, resolveNetworkIcon, getAllNetworkNames } = useRegistry();
  const NETWORK_NAMES = getAllNetworkNames();
  const [loading, setLoading] = useState(false);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [summary, setSummary] = useState<{assets: number, index: number, diff: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'management'>('form');
  const [allIndexProducts, setAllIndexProducts] = useState<PendingProduct[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [availableTickers, setAvailableTickers] = useState<string[]>([]);
  const [knownPlatforms, setKnownPlatforms] = useState<string[]>([]);
  const [knownCurators, setKnownCurators] = useState<string[]>([]);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [syncConfirmOpen, setSyncConfirmOpen] = useState(false);
  const [apySortDir, setApySortDir] = useState<'desc' | 'asc' | null>(null);
  const [tvlSortDir, setTvlSortDir] = useState<'desc' | 'asc' | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    ticker: '',
    network: 'Ethereum',
    platform: '',
    productName: '',
    curator: '',
    productLink: '',
    defillama_link: '',
    vault_address: ''
  });

  const fetchSummary = async () => {
    try {
      const data = await api.fetchSummaryCounts();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary counts:", err);
    }
  };

  const fetchPending = async () => {
    try {
      setIsLoadingPending(true);
      const data = await api.fetchPendingProducts();
      setPendingProducts(data);
    } catch (err) {
      console.error("Failed to fetch pending products:", err);
    } finally {
      setIsLoadingPending(false);
    }
  };

  const fetchAvailableTickers = async () => {
    try {
      const { products: data } = await api.fetchPools();
      const products = data || [];
      const uniqueTickers = [...new Set<string>(
        products
          .map((p: any) => (p.ticker || p.vault || '').toUpperCase())
          .filter((t: string) => t && t !== 'N/A')
      )].sort();
      setAvailableTickers(uniqueTickers);

      // Extract known platforms and curators for combobox suggestions
      const platforms = [...new Set<string>(
        products
          .map((p: any) => (p.platform_name || p.platform || '').trim())
          .filter((s: string) => s && s !== 'Unknown')
      )].sort();
      setKnownPlatforms(platforms);

      const curators = [...new Set<string>(
        products
          .map((p: any) => (p.curator || '').trim())
          .filter((s: string) => s && s !== '-' && s !== '')
      )].sort();
      setKnownCurators(curators);
      setLiveProducts(products);
    } catch (err) {
      console.error("Failed to fetch available tickers:", err);
    }
  };
  
  // Single combined fetch to avoid circular dependencies
  const refreshAll = async () => {
    await Promise.all([fetchPending(), fetchSummary(), fetchAvailableTickers()]);
  };

  const fetchAllIndex = async () => {
    try {
      setIsLoadingAll(true);
      const data = await api.fetchAllIndexProducts();
      setAllIndexProducts(data);
    } catch (err) {
      console.error("Failed to fetch all index products:", err);
    } finally {
      setIsLoadingAll(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (activeTab === 'management') {
      fetchAllIndex();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createIndexProduct(formData);
      toast.success("Product indexed successfully!");
      
      setFormData({
        ticker: '',
        network: 'Ethereum',
        platform: '',
        productName: '',
        curator: '',
        productLink: '',
        defillama_link: '',
        vault_address: ''
      });
      refreshAll();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await api.syncIndex();
      await api.syncProducts();
      
      toast.success("Synchronized all tables with Production!");
      fetchAllIndex();
      refreshAll();
    } catch (err) {
      toast.error("Failed to sync database.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProcessProduct = async (product: PendingProduct) => {
    try {
      await api.createPool({
        id: product.id,
        vault: product.ticker,
        network: product.network,
        platform: product.platform,
        productName: product.productName || (product as any).product_name,
        product_link: (product as any).productLink || (product as any).product_link || '#',
        defillama_link: product.defillamaId || product.defillamaID || product.defillama_id || '',
        spotApy: 0,
        weeklyApy: 0,
        monthlyApy: 0,
        tvl: 0
      });

      toast.success("Product moved to Dashboard!");
      refreshAll();
    } catch (err) {
      toast.error("Failed to process product.");
    }
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const handleEdit = (product: PendingProduct) => {
    setEditingId(product.id);
    setEditFormData({
      productName: product.productName || (product as any).product_name,
      platform: product.platform || (product as any).platform_name,
      ticker: product.ticker,
      network: product.network,
      curator: product.curator || (product as any).curator || '',
      defillamaId: product.defillamaId || product.defillamaID || product.defillama_id || '',
      productLink: (product as any).productLink || (product as any).product_link || '',
      vault_address: product.vault_address || ''
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await api.updateIndexProduct(id, editFormData);
      toast.success("Record updated in Index!");
      setEditingId(null);
      fetchAllIndex();
      refreshAll();
    } catch (err) {
      toast.error("Failed to update record.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteIndexProduct(id);
      toast.success("Record deleted from Index!");
      setDeleteConfirmId(null);
      if (editingId === id) setEditingId(null);
      fetchAllIndex();
      refreshAll();
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  const filteredPending = pendingProducts.filter(p => {
    const search = searchQuery.toLowerCase();
    const ticker = (p.ticker || '').toLowerCase();
    const productName = (p.productName || (p as any).product_name || '').toLowerCase();
    const platform = (p.platform || (p as any).platform_name || '').toLowerCase();
    const network = (p.network || '').toLowerCase();
    
    return (
      ticker.includes(search) ||
      productName.includes(search) ||
      platform.includes(search) ||
      network.includes(search)
    );
  });

  const filteredAll = allIndexProducts.filter(p => {
    const search = searchQuery.toLowerCase();
    const ticker = (p.ticker || '').toLowerCase();
    const productName = (p.productName || (p as any).product_name || '').toLowerCase();
    const platform = (p.platform || (p as any).platform_name || '').toLowerCase();
    const network = (p.network || '').toLowerCase();
    const curator = (p.curator || '').toLowerCase();
    const idStr = (p.id || '').toString();
    
    return (
      ticker.includes(search) ||
      productName.includes(search) ||
      platform.includes(search) ||
      network.includes(search) ||
      curator.includes(search) ||
      idStr.includes(search)
    );
  });

  // Build defillamaId -> spotAPY lookup from live Products for the Index table
  const apyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of liveProducts) {
      const did = (p.defillamaId || p.defillamaID || p.defillama_id || p.defillama_link || '').toString().toLowerCase().trim();
      if (did) {
        const apy = parseFloat(p.spotAPY || p.spotApy || p.dailyApy || p.dailyAPY || 0);
        if (!isNaN(apy)) map.set(did, apy);
      }
    }
    return map;
  }, [liveProducts]);

  // Build defillamaId -> TVL lookup from live Products
  const tvlMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of liveProducts) {
      const did = (p.defillamaId || p.defillamaID || p.defillama_id || p.defillama_link || '').toString().toLowerCase().trim();
      if (did) {
        const tvl = parseFloat(p.tvl || 0);
        if (!isNaN(tvl)) map.set(did, tvl);
      }
    }
    return map;
  }, [liveProducts]);

  // Sort filteredAll by APY or TVL (only one active at a time)
  const sortedFilteredAll = useMemo(() => {
    if (apySortDir) {
      return [...filteredAll].sort((a, b) => {
        const didA = (a.defillamaId || a.defillamaID || a.defillama_id || '').toLowerCase();
        const didB = (b.defillamaId || b.defillamaID || b.defillama_id || '').toLowerCase();
        const apyA = apyMap.get(didA) ?? -1;
        const apyB = apyMap.get(didB) ?? -1;
        return apySortDir === 'desc' ? apyB - apyA : apyA - apyB;
      });
    }
    if (tvlSortDir) {
      return [...filteredAll].sort((a, b) => {
        const didA = (a.defillamaId || a.defillamaID || a.defillama_id || '').toLowerCase();
        const didB = (b.defillamaId || b.defillamaID || b.defillama_id || '').toLowerCase();
        const tvlA = tvlMap.get(didA) ?? -1;
        const tvlB = tvlMap.get(didB) ?? -1;
        return tvlSortDir === 'desc' ? tvlB - tvlA : tvlA - tvlB;
      });
    }
    return filteredAll;
  }, [filteredAll, apySortDir, tvlSortDir, apyMap, tvlMap]);

  const handleCopyField = (key: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Summary Banner */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#08a671]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#08a671]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Live Assets</p>
                <p className="text-xl font-bold text-foreground">{summary.assets}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ListFilter className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Total in Index</p>
                <p className="text-xl font-bold text-foreground">{summary.index}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Pending Inclusion</p>
                <p className="text-xl font-bold text-amber-600">{summary.diff}</p>
              </div>
            </div>
            {summary.diff > 0 && (
              <div className="bg-amber-100 px-2 py-1 rounded-lg text-[10px] font-bold text-amber-700 animate-pulse">
                SYNC NEEDED
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-1 max-w-md items-center gap-2 relative group">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Search by asset, platform, curator, network or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all"
            />
            <ListFilter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#08a671] transition-colors" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {activeTab === 'management' && (
            <div className="bg-[#08a671]/10 text-[#08a671] px-3 py-1.5 rounded-full text-[11px] font-bold border border-[#08a671]/20 whitespace-nowrap tabular-nums shrink-0">
              {filteredAll.length} {searchQuery ? 'matches' : 'total'}
            </div>
          )}
        </div>

        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border">
          <button 
            onClick={() => setActiveTab('form')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Add Product
          </button>
          <button 
            onClick={() => setActiveTab('management')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'management' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            List Yield (Index)
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/50">
                <h1 className="text-base font-semibold text-foreground">Add New DeFi Product</h1>
                <p className="text-muted-foreground text-xs mt-1">Submit to the Index table for processing</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <section className="space-y-4">
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    Basic Info
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Ticker</label>
                      <select
                        required
                        name="ticker"
                        value={formData.ticker}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-[24px] focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select asset...</option>
                        {availableTickers.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Network</label>
                      <select
                        name="network"
                        value={formData.network}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-[24px] focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground"
                      >
                        {NETWORK_NAMES.map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    Platform
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Platform</label>
                      <ComboInput
                        required
                        name="platform"
                        value={formData.platform}
                        onChange={(val) => setFormData(prev => ({ ...prev, platform: val }))}
                        placeholder="e.g. Aave"
                        suggestions={knownPlatforms}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Curator <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <ComboInput
                        name="curator"
                        value={formData.curator}
                        onChange={(val) => setFormData(prev => ({ ...prev, curator: val }))}
                        placeholder="e.g. Steakhouse, Gauntlet"
                        suggestions={knownCurators}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Product Name</label>
                    <input
                      required
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="e.g. Core USDC"
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-[24px] focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground"
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" />
                    Links
                  </h2>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">DeFiLlama Yield Link</label>
                      <input
                        name="defillama_link"
                        value={formData.defillama_link}
                        onChange={handleChange}
                        placeholder="https://defillama.com/yields/pool/..."
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-[24px] focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Official Product Link</label>
                      <input
                        required
                        name="productLink"
                        value={formData.productLink}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-[24px] focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Vault Address <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <input
                        name="vault_address"
                        value={formData.vault_address}
                        onChange={handleChange}
                        placeholder="0x..."
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-[24px] focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground font-mono"
                      />
                    </div>
                  </div>
                </section>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-[#08a671] text-white rounded-[24px] text-sm font-bold hover:bg-[#08a671]/90 transition-all shadow-md shadow-[#08a671]/10 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Index Product
                  </button>
                </div>

                {/* Live slug preview */}
                {formData.ticker && formData.productName && formData.platform && (
                  <div className="rounded-xl bg-muted/40 border border-border px-4 py-3 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Generated URL Slug</p>
                    <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                      /vault/{generateVaultSlug(
                        formData.ticker,
                        formData.productName,
                        formData.platform,
                        formData.curator && formData.curator.trim() ? formData.curator.trim() : null,
                        formData.network
                      )}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* CRM / Pending Inclusion Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col h-full max-h-[700px]">
              <div className="p-5 border-b border-border bg-card flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Pending Inclusion
                  </h2>
                  <p className="text-muted-foreground text-xs mt-0.5">Products in Index waiting for data sync</p>
                </div>
                <div className="bg-amber-100 px-2.5 py-1 rounded-full text-[10px] font-black text-amber-700 uppercase tracking-wider">
                  {filteredPending.length} Pending
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                {isLoadingPending ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Checking Inclusion Status...</p>
                  </div>
                ) : filteredPending.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="w-12 h-12 bg-[#08a671]/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-[#08a671]" />
                    </div>
                    <p className="text-foreground text-sm font-semibold italic">
                      All products included
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      Every manual entry from the Index table has its corresponding record in the Products table.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredPending.map((product) => {
                      return (
                        <div 
                          key={product.id}
                          className="p-3 bg-amber-50/30 hover:bg-amber-50/50 border border-amber-100 rounded-xl transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                  #{product.id}
                                </span>
                                <h3 className="text-sm font-bold text-foreground truncate">
                                  {product.platform}: {product.productName || (product as any).product_name}
                                </h3>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {product.network}
                                </span>
                                <span className="text-border">•</span>
                                <span className="font-mono text-amber-600 font-bold">{product.ticker}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-white border border-amber-200 rounded text-[9px] font-bold text-amber-600 animate-pulse">
                                <div className="w-1 h-1 bg-amber-600 rounded-full" />
                                AWAITING SYNC
                              </div>
                              <div className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter text-right leading-tight">
                                Data Script<br/>Processing
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border bg-amber-50/20">
                <div className="flex items-center gap-2 text-[9px] text-amber-600 uppercase font-bold tracking-[0.1em]">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  Sequence: Index (Manual) → Script → Products (Live)
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <span className="contents">
          {/* Table */}
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden transition-colors duration-300">
            <div className="w-full overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-card border-b border-border">
                    <th className="pl-5 pr-1 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] w-[50px]">#</th>
                    <th className="pl-3 pr-1 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Asset</th>
                    <th className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Product</th>
                    <th
                      className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-right cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => { setTvlSortDir(null); setApySortDir(prev => prev === 'desc' ? 'asc' : prev === 'asc' ? null : 'desc'); }}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        APY
                        {apySortDir === 'desc' ? (
                          <ChevronDown className="w-3 h-3 text-[#08a671]" />
                        ) : apySortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3 text-[#08a671]" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    </th>
                    <th
                      className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-right cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => { setApySortDir(null); setTvlSortDir(prev => prev === 'desc' ? 'asc' : prev === 'asc' ? null : 'desc'); }}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        TVL
                        {tvlSortDir === 'desc' ? (
                          <ChevronDown className="w-3 h-3 text-[#08a671]" />
                        ) : tvlSortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3 text-[#08a671]" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    </th>
                    <th className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Network</th>
                    <th className="px-3 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">URL Slug</th>
                    <th className="w-[40px] pr-4 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isLoadingAll ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="pl-5 py-4"><div className="h-3 w-6 bg-muted rounded" /></td>
                        <td className="pl-3 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-muted" /><div className="h-3 w-10 bg-muted rounded" /></div></td>
                        <td className="px-3 py-4"><div className="space-y-1.5"><div className="h-3 w-28 bg-muted rounded" /><div className="h-2 w-16 bg-muted rounded" /></div></td>
                        <td className="px-3 py-4 text-right"><div className="h-3 w-12 bg-muted rounded ml-auto" /></td>
                        <td className="px-3 py-4 text-right"><div className="h-3 w-12 bg-muted rounded ml-auto" /></td>
                        <td className="px-3 py-4"><div className="h-3 w-16 bg-muted rounded" /></td>
                        <td className="px-3 py-4"><div className="h-3 w-32 bg-muted rounded" /></td>
                        <td className="pr-4 py-4"><div className="h-4 w-4 bg-muted rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : sortedFilteredAll.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-20 text-center text-muted-foreground text-sm italic">
                        {searchQuery ? 'No records match your search query.' : 'No records found in Index.'}
                      </td>
                    </tr>
                  ) : (
                    sortedFilteredAll.flatMap((product) => {
                      const isExpanded = editingId === product.id;
                      const productName = product.productName || (product as any).product_name || '';
                      const platform = product.platform || (product as any).platform_name || '';
                      const curator = product.curator && product.curator !== '-' ? product.curator : '';
                      const defillamaId = product.defillamaId || product.defillamaID || product.defillama_id || '';
                      const slug = product.url || generateVaultSlug(
                        product.ticker,
                        productName,
                        platform,
                        curator || null,
                        product.network
                      );

                      const rows: React.ReactNode[] = [
                        <tr
                          key={product.id}
                          onClick={() => {
                            if (isExpanded) {
                              setEditingId(null);
                            } else {
                              handleEdit(product);
                            }
                          }}
                          className={`hover:bg-muted/30 transition-colors group cursor-pointer ${isExpanded ? 'bg-muted/20' : ''}`}
                        >
                          <td className="pl-5 pr-1 py-3 align-middle text-[11px] font-normal text-muted-foreground/60">
                            {product.id}
                          </td>
                          <td className="pl-3 pr-1 py-3 align-middle">
                            <div className="flex items-center">
                              <div className="flex items-center shrink-0">
                                <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden shrink-0" title={product.network}>
                                  <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <div className="w-7 h-7 flex items-center justify-center shrink-0 ml-1">
                                  {resolveAssetIcon(product.ticker) ? (
                                    <img src={resolveAssetIcon(product.ticker)!} alt={product.ticker} className="w-full h-full object-contain" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                      <span className="text-[9px] font-bold text-foreground">{(product.ticker || '?')[0].toUpperCase()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="text-[13px] font-medium text-foreground ml-2">{product.ticker}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-[13px] font-semibold text-foreground leading-tight truncate">
                                {productName}
                                {curator && (
                                  <span className="font-medium text-muted-foreground"> · {curator}</span>
                                )}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate tracking-wide font-normal mt-0.5">
                                {platform}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3 align-middle text-right">
                            {(() => {
                              const apy = apyMap.get(defillamaId.toLowerCase());
                              return apy !== undefined ? (
                                <span className="text-[13px] font-semibold text-[#08a671] tabular-nums">
                                  {formatAPY(apy)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/40 font-medium">-</span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-3 align-middle text-right">
                            {(() => {
                              const tvl = tvlMap.get(defillamaId.toLowerCase());
                              return tvl !== undefined ? (
                                <span className="text-[12px] font-medium text-muted-foreground tabular-nums">
                                  {formatTVL(tvl)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/40 font-medium">-</span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-bold text-muted-foreground">
                              {product.network}
                            </span>
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <span className="text-[10px] font-mono text-muted-foreground/60 break-all leading-tight">
                              {slug}
                            </span>
                          </td>
                          <td className="pr-4 py-3 align-middle w-[40px]">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#08a671] inline-block ml-auto" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground transition-colors duration-150 inline-block ml-auto" />
                            )}
                          </td>
                        </tr>
                      ];

                      if (isExpanded && editFormData) {
                        rows.push(
                          <tr key={`edit-${product.id}`}>
                            <td colSpan={8} className="p-0">
                              <div className="bg-muted/10 border-t border-border px-5 py-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                  {/* Product Name */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product Name</label>
                                    <input
                                      value={editFormData.productName}
                                      onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                                      className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground font-medium"
                                    />
                                  </div>

                                  {/* Platform */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform</label>
                                    <ComboInput
                                      value={editFormData.platform}
                                      onChange={(val) => setEditFormData({ ...editFormData, platform: val })}
                                      suggestions={knownPlatforms}
                                      className="rounded-xl font-medium"
                                    />
                                  </div>

                                  {/* Curator */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Curator</label>
                                    <ComboInput
                                      value={editFormData.curator}
                                      onChange={(val) => setEditFormData({ ...editFormData, curator: val })}
                                      placeholder="optional"
                                      suggestions={knownCurators}
                                      className="rounded-xl font-medium"
                                    />
                                  </div>

                                  {/* Network */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Network</label>
                                    <select
                                      value={editFormData.network || product.network}
                                      onChange={(e) => setEditFormData({ ...editFormData, network: e.target.value })}
                                      className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground font-medium appearance-none cursor-pointer"
                                    >
                                      {NETWORK_NAMES.map(n => (
                                        <option key={n} value={n}>{n}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* DeFiLlama ID */}
                                  <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DeFiLlama ID</label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        value={editFormData.defillamaId}
                                        onChange={(e) => setEditFormData({ ...editFormData, defillamaId: e.target.value })}
                                        className="flex-1 px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground font-mono"
                                      />
                                      {editFormData.defillamaId && (
                                        <a
                                          href={`https://defillama.com/yields/pool/${editFormData.defillamaId}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                          title="Open on DeFiLlama"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                                        </a>
                                      )}
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleCopyField(`defillama-${product.id}`, editFormData.defillamaId); }}
                                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                        title="Copy DeFiLlama ID"
                                      >
                                        {copiedField === `defillama-${product.id}` ? (
                                          <Check className="w-3.5 h-3.5 text-[#08a671]" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Product Link */}
                                  <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product Link</label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        value={editFormData.productLink}
                                        onChange={(e) => setEditFormData({ ...editFormData, productLink: e.target.value })}
                                        placeholder="https://..."
                                        className="flex-1 px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground font-mono placeholder:text-muted-foreground/30"
                                      />
                                      {editFormData.productLink && (
                                        <a
                                          href={editFormData.productLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                          title="Open Product Link"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                                        </a>
                                      )}
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleCopyField(`productlink-${product.id}`, editFormData.productLink); }}
                                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                        title="Copy Product Link"
                                      >
                                        {copiedField === `productlink-${product.id}` ? (
                                          <Check className="w-3.5 h-3.5 text-[#08a671]" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Vault Address */}
                                  <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vault Address</label>
                                    <input
                                      value={editFormData.vault_address}
                                      onChange={(e) => setEditFormData({ ...editFormData, vault_address: e.target.value })}
                                      placeholder="0x..."
                                      className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground font-mono placeholder:text-muted-foreground/30"
                                    />
                                  </div>
                                </div>

                                {/* Frozen URL / View Product Page */}
                                <div className="mt-4">
                                  {product.url ? (
                                    <a
                                      href={`https://earnbase.finance/vault/${product.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="group/link inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                                    >
                                      <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                      <span className="text-[11px] text-blue-600 dark:text-blue-400">
                                        URL is frozen: <span className="font-mono font-medium">/vault/{product.url}</span>
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-blue-400 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                                    </a>
                                  ) : slug ? (
                                    <a
                                      href={`https://earnbase.finance/vault/${slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="group/link inline-flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                      <span className="text-[11px] text-muted-foreground">
                                        View Product Page <span className="font-mono font-medium opacity-60">/vault/{slug}</span>
                                      </span>
                                    </a>
                                  ) : null}
                                </div>

                                {/* Action buttons */}
                                <div className="mt-5 flex items-center gap-3">
                                  <button
                                    onClick={() => handleSaveEdit(product.id)}
                                    className="flex items-center gap-2 px-5 py-2 bg-[#08a671] text-white rounded-full text-xs font-bold hover:bg-[#08a671]/90 transition-all shadow-sm active:scale-95 cursor-pointer"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="flex items-center gap-2 px-5 py-2 bg-muted text-muted-foreground rounded-full text-xs font-bold hover:bg-muted/70 transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <div className="flex-1" />
                                  <button
                                    onClick={() => setDeleteConfirmId(product.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full text-xs font-bold transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return rows;
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sync from Production - bottom of page */}
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={() => setSyncConfirmOpen(true)}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync from Production
            </button>
          </div>
        </span>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId !== null && (() => {
        const target = allIndexProducts.find(p => p.id === deleteConfirmId);
        const targetName = target
          ? `${target.productName || (target as any).product_name || 'Unnamed'} (${target.platform || (target as any).platform_name || ''}, ${target.ticker})`
          : `#${deleteConfirmId}`;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">Delete from Index?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This will permanently remove <span className="font-semibold text-foreground">{targetName}</span> from
                    the Index table. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2 bg-muted text-muted-foreground rounded-full text-xs font-bold hover:bg-muted/70 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sync confirmation modal */}
      {syncConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSyncConfirmOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">Sync from Production?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This will overwrite both the <span className="font-semibold text-foreground">Index</span> and <span className="font-semibold text-foreground">Products</span> tables
                  with the latest data from Production. Any unsaved local edits will be lost.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSyncConfirmOpen(false)}
                className="px-5 py-2 bg-muted text-muted-foreground rounded-full text-xs font-bold hover:bg-muted/70 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSyncConfirmOpen(false);
                  handleSync();
                }}
                className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-full text-xs font-bold hover:bg-amber-600 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Yes, Sync Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};