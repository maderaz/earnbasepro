/**
 * usePageViewTracker — fires a single page view event on every route change.
 * Lightweight: one POST per navigation, fire-and-forget.
 * Excludes /control-room and /add-product from tracking.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import * as api from '@/app/utils/api';

const EXCLUDED_ROUTES = ['/control-room', '/add-product'];

/** Extract context from the current pathname */
function extractContext(pathname: string): {
  tickerContext: string;
  networkContext: string;
  vaultSlug: string;
} {
  const segments = pathname.split('/').filter(Boolean);

  // /vault/:slug
  if (segments[0] === 'vault' && segments[1]) {
    return { tickerContext: '', networkContext: '', vaultSlug: segments[1] };
  }

  // /:ticker/:network
  if (segments.length === 2) {
    return { tickerContext: segments[0], networkContext: segments[1], vaultSlug: '' };
  }

  // /:ticker
  if (segments.length === 1 && segments[0] !== 'sitemap') {
    return { tickerContext: segments[0], networkContext: '', vaultSlug: '' };
  }

  return { tickerContext: '', networkContext: '', vaultSlug: '' };
}

export function usePageViewTracker() {
  const location = useLocation();
  const lastTrackedRef = useRef<string>('');

  useEffect(() => {
    const { pathname } = location;

    // Don't track internal/admin routes
    if (EXCLUDED_ROUTES.some(r => pathname.startsWith(r))) return;

    // Deduplicate — don't re-track the same path within the same render cycle
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    const context = extractContext(pathname);

    api.trackPageView({
      route: pathname,
      ...context,
    });
  }, [location.pathname]);
}
