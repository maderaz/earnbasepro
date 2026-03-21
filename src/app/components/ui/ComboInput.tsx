/**
 * ComboInput -- Hybrid input that lets the user type freely while showing
 * a filtered dropdown of existing values. Selecting a suggestion fills the
 * input but doesn't lock it -- you can always keep typing to enter a new
 * value. Finance-pro flat style, rounded-lg soft shape.
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';

interface ComboInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
  name?: string;
  className?: string;
}

export const ComboInput: React.FC<ComboInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder,
  required,
  name,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return suggestions.slice(0, 12);
    const q = value.toLowerCase();
    return suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 12);
  }, [value, suggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIdx]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setHighlightIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => (prev <= 0 ? filtered.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const isExactMatch = suggestions.some(s => s.toLowerCase() === value.toLowerCase());

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        name={name}
        required={required}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setHighlightIdx(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all text-foreground ${className}`}
      />
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-card border border-border rounded-xl shadow-lg py-1"
        >
          {filtered.map((item, idx) => {
            const isActive = idx === highlightIdx;
            const isCurrent = item.toLowerCase() === value.toLowerCase();
            return (
              <li
                key={item}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
                onMouseEnter={() => setHighlightIdx(idx)}
                className={`px-3 py-1.5 text-sm cursor-pointer transition-colors ${isActive ? 'bg-[#08a671]/10 text-[#08a671]' : 'text-foreground hover:bg-muted/50'} ${isCurrent ? 'font-semibold' : 'font-normal'}`}
              >
                {item}
              </li>
            );
          })}
          {value.trim() && !isExactMatch && (
            <li className="px-3 py-1.5 text-[11px] text-muted-foreground border-t border-border mt-1 pt-1.5">
              Press Enter to use &quot;{value.trim()}&quot; as new value
            </li>
          )}
        </ul>
      )}
    </div>
  );
};