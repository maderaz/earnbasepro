/**
 * ControlRoomRules — Slim orchestrator that composes all 6 rules.
 * Each rule lives in its own file under /rules/ for modular file sizes.
 */
import React from 'react';
import { DeduplicateProductsRule, ExtractCuratorRule } from './rules/DataCleanupRules';
import { ConsolidateNamesRule, SyncNamesFromIndexRule } from './rules/SyncRules';
import { YieldMicroDeviationRule } from './rules/YieldDeviationRule';
import { AssetDisplayRule } from './rules/AssetDisplayRule';

export const ControlRoomRules: React.FC = () => {
  return (
    <div className="space-y-6">
      <AssetDisplayRule />
      <SyncNamesFromIndexRule />
      <DeduplicateProductsRule />
      <ExtractCuratorRule />
      <ConsolidateNamesRule />
      <YieldMicroDeviationRule />

      {/* Footer */}
      <div className="px-1 flex items-center gap-2 text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
        <span className="w-1.5 h-1.5 bg-[#08a671] rounded-full" />
        6 rules configured
      </div>
    </div>
  );
};