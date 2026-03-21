/**
 * KVRow — Flat key-value row with thin separator.
 * Inspired by Figma pricing table: labels use Inter Medium #71717b,
 * values use #09090b — labels stay a step lighter than values.
 *
 * Optional `tooltip` prop adds a Radix Tooltip on desktop / tap-to-expand on mobile.
 * Optional `labelSuffix` renders extra ReactNode after the label (e.g. PeriodSuffix).
 */
import React from 'react';
import { TooltipLabel } from './TooltipLabel';

export const KVRow: React.FC<{
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  noBorder?: boolean;
  tooltip?: string;
  labelSuffix?: React.ReactNode;
}> = ({ label, value, valueColor, noBorder, tooltip, labelSuffix }) => (
  <div className={`flex items-center justify-between py-[11px] ${noBorder ? '' : 'border-b border-[#eff0f4] dark:border-border/30'}`}>
    <span className="text-[13px] font-medium text-[#71717b] dark:text-muted-foreground/60 flex items-baseline gap-0">
      {tooltip ? (
        <TooltipLabel tooltip={tooltip}>{label}</TooltipLabel>
      ) : (
        label
      )}
      {labelSuffix}
    </span>
    <span className={`text-[13px] font-medium tabular-nums text-right ${valueColor || 'text-[#09090b] dark:text-foreground/90'}`}>{value}</span>
  </div>
);
