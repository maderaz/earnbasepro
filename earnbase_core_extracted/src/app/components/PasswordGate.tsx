/**
 * PasswordGate — simple password wall for protected routes.
 * Stores unlock state in sessionStorage (clears on tab close).
 * Zero bold – semibold/medium/normal only (Maple Look typography).
 */
import React, { useState, useCallback } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'earnbase:cr-unlocked';

interface PasswordGateProps {
  password: string;
  children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ password, children }) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input === password) {
        sessionStorage.setItem(STORAGE_KEY, '1');
        setUnlocked(true);
        setError(false);
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setInput('');
      }
    },
    [input, password],
  );

  if (unlocked) {
    return <div className="contents">{children}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div
        className={`w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden transition-transform ${shaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Control Room</h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Enter password to continue
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
          <div className="relative">
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3 bg-muted/40 border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:ring-2 focus:ring-[#08a671]/30 focus:border-[#08a671] ${
                error
                  ? 'border-red-400 dark:border-red-500/60 bg-red-50/50 dark:bg-red-500/5'
                  : 'border-border'
              }`}
            />
            {error && (
              <p className="text-[11px] font-medium text-red-500 mt-1.5 pl-1">
                Incorrect password
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#08a671] hover:bg-[#079163] disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            Unlock
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Shake keyframes (injected once) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};
