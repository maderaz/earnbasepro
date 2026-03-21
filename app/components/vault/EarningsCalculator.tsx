'use client';
/**
 * EarningsCalculator — simple earnings estimate widget.
 * Ported from src/app/components/vault/EarningsCalculator.tsx
 */
import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { TooltipLabel } from '../ui/TooltipLabel';

const PRESETS = [1_000, 5_000, 10_000, 50_000];

const EARNINGS = {
  Daily: 'Estimated daily earnings at the current on-chain APY, compounded annually.',
  Monthly: 'Estimated monthly earnings at the current on-chain APY, compounded annually.',
  Yearly: 'Estimated annual earnings at the current on-chain APY. This is a projection, not a guarantee.',
};

interface EarningsCalculatorProps {
  apy: number;
  ticker: string;
  isPrivateCredit?: boolean;
}

const fmt = (n: number) =>
  n >= 1
    ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${n.toFixed(4)}`;

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ apy, ticker, isPrivateCredit = false }) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(5_000);
  const [customValue, setCustomValue] = useState('');

  const principal = selectedPreset ?? (parseFloat(customValue) || 0);

  const projections = useMemo(() => {
    if (!principal || principal <= 0 || apy <= 0) return null;
    const rate = apy / 100;
    const yearly = principal * rate;
    const monthly = principal * ((1 + rate) ** (1 / 12) - 1);
    const daily = principal * ((1 + rate) ** (1 / 365) - 1);
    return { daily, monthly, yearly };
  }, [principal, apy]);

  const handlePreset = (amount: number) => { setSelectedPreset(amount); setCustomValue(''); };
  const handleCustom = (val: string) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    setCustomValue(cleaned);
    setSelectedPreset(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-3.5 h-3.5 text-[#a0a0b0]" />
        <span className="text-[13px] font-medium text-[#30313e] dark:text-foreground/80">Earnings Estimate</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-2">
        {PRESETS.map(amount => (
          <button
            key={amount}
            onClick={() => handlePreset(amount)}
            className={`py-1.5 text-[12px] font-medium rounded-[8px] border transition-all ${
              selectedPreset === amount
                ? 'bg-[#08a671]/[0.06] border-[#08a671]/20 text-[#08a671]'
                : 'bg-[#f8f8fa] dark:bg-white/[0.04] border-[#eff0f4] dark:border-white/[0.08] text-[#6b6b7b] dark:text-foreground/50 hover:border-[#d0d0d8]'
            }`}
          >
            ${amount.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#a0a0b0] font-medium">$</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Custom amount"
          value={customValue}
          onChange={e => handleCustom(e.target.value)}
          onFocus={() => setSelectedPreset(null)}
          className="w-full pl-6 pr-3 py-2 text-[12px] font-medium text-[#30313e] dark:text-foreground/80 bg-[#f8f8fa] dark:bg-white/[0.04] border border-[#eff0f4] dark:border-white/[0.08] rounded-[8px] outline-none focus:border-[#08a671]/30 transition-colors placeholder:text-[#c0c0cc]"
        />
      </div>

      {projections ? (
        <div className="space-y-0">
          <div className="flex items-center justify-between py-2 border-b border-[#eff0f4] dark:border-white/[0.06]">
            <span className="text-[13px] font-medium text-[#71717b]"><TooltipLabel tooltip={EARNINGS.Daily}>Daily</TooltipLabel></span>
            <span className="text-[13px] font-medium text-[#30313e] dark:text-foreground/80 tabular-nums">{fmt(projections.daily)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#eff0f4] dark:border-white/[0.06]">
            <span className="text-[13px] font-medium text-[#71717b]"><TooltipLabel tooltip={EARNINGS.Monthly}>Monthly</TooltipLabel></span>
            <span className="text-[13px] font-medium text-[#30313e] dark:text-foreground/80 tabular-nums">{fmt(projections.monthly)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] font-medium text-[#71717b]"><TooltipLabel tooltip={EARNINGS.Yearly}>Yearly</TooltipLabel></span>
            <span className="text-[13px] font-medium text-[#08a671] tabular-nums">{fmt(projections.yearly)}</span>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-[12px] text-[#c0c0cc]">Enter an amount to see projections</div>
      )}

      <p className="mt-3 text-[10px] leading-relaxed text-[#52525b] dark:text-foreground/40 font-normal">
        {isPrivateCredit
          ? `For illustrative purposes only. Based on the current ${apy.toFixed(2)}% on-chain APY for ${ticker.toUpperCase()}. This is a fixed-rate product.`
          : `For illustrative purposes only. Based on the current ${apy.toFixed(2)}% on-chain APY for ${ticker.toUpperCase()}. Does not include external incentives. Past performance does not guarantee future results.`
        }
      </p>
    </div>
  );
};
