'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SUPABASE_API_URL, SUPABASE_ANON_KEY } from '@/lib/supabase-config';

const EXCLUDED = ['/control-room', '/studio'];

function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') return 'ssr';
  const key = 'earnbase_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

function extractContext(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'vault' && segments[1]) return { tickerContext: '', networkContext: '', vaultSlug: segments[1] };
  if (segments.length === 2) return { tickerContext: segments[0], networkContext: segments[1], vaultSlug: '' };
  if (segments.length === 1 && segments[0] !== 'sitemap') return { tickerContext: segments[0], networkContext: '', vaultSlug: '' };
  return { tickerContext: '', networkContext: '', vaultSlug: '' };
}

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef('');

  useEffect(() => {
    if (EXCLUDED.some(r => pathname.startsWith(r))) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const context = extractContext(pathname);

    fetch(`${SUPABASE_API_URL}/pageviews/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        route: pathname,
        ...context,
        sessionId: getSessionId(),
        ts: Date.now(),
        meta: {
          userAgent: navigator.userAgent,
          language: navigator.language || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
          screenWidth: window.screen?.width || 0,
          screenHeight: window.screen?.height || 0,
          referrer: document.referrer || '',
          pageUrl: window.location.href || '',
        },
      }),
    }).catch(() => {/* fire-and-forget */});
  }, [pathname]);

  return null;
}
