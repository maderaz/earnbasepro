/**
 * TooltipLabel — Radix Tooltip on hover (desktop) / tap (mobile).
 * Always renders as a dark floating cloud, never inline text.
 * Earnbase dark tooltip style: #1a1a1a bg, white text, rounded-[8px].
 */
import React, { useState, useCallback } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipLabelProps {
  /** The visible label text (or ReactNode) */
  children: React.ReactNode;
  /** Short definition shown on hover / tap */
  tooltip: string;
  /** Extra class on the trigger span */
  className?: string;
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({ children, tooltip, className = '' }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback((e: React.PointerEvent) => {
    // Only toggle on touch — desktop hover is handled by onOpenChange
    if (e.pointerType === 'touch') {
      e.preventDefault();
      setOpen(o => !o);
    }
  }, []);

  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>
          <span
            className={`cursor-help border-b border-dotted border-[#a0a0b0]/50 ${className}`}
            tabIndex={0}
            onPointerDown={handleToggle}
          >
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={6}
            onPointerDownOutside={() => setOpen(false)}
            className="max-w-[240px] px-3 py-2 bg-[#1a1a1a] text-white text-[12px] font-normal leading-[1.5] rounded-[8px] shadow-lg z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            {tooltip}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

/**
 * PeriodSuffix — muted "(Xd)" suffix for incomplete data periods.
 * Shows only when dataPoints < maxPeriod.
 */
export const PeriodSuffix: React.FC<{
  dataPoints: number;
  maxPeriod?: number;
}> = ({ dataPoints, maxPeriod = 30 }) => {
  if (dataPoints >= maxPeriod) return null;

  const tooltipText = `Based on ${dataPoints} of ${maxPeriod} days. This product was recently added to the Earnbase index.`;
  const [open, setOpen] = useState(false);

  const handleToggle = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') {
      e.preventDefault();
      setOpen(o => !o);
    }
  };

  return (
    <span className="ml-1">
      <TooltipPrimitive.Provider delayDuration={300}>
        <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
          <TooltipPrimitive.Trigger asChild>
            <span
              className="text-[11px] font-medium text-[#a0a0b0] cursor-help"
              tabIndex={0}
              onPointerDown={handleToggle}
            >
              ({dataPoints}d)
            </span>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="top"
              sideOffset={6}
              onPointerDownOutside={() => setOpen(false)}
              className="max-w-[240px] px-3 py-2 bg-[#1a1a1a] text-white text-[12px] font-normal leading-[1.5] rounded-[8px] shadow-lg z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              {tooltipText}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </span>
  );
};
