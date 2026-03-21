/**
 * Earnbase Edge Function — Slim entry point.
 * Routes are split into separate modules for maintainability.
 * v2 — re-deploy trigger
 */
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { registerRegistryRoutes } from "./registry-routes.tsx";
import { registerProductRoutes } from "./product-routes.tsx";
import { registerRuleRoutes } from "./rule-routes.tsx";
import { registerClickRoutes } from "./click-routes.tsx";
import { registerSearchRoutes } from "./search-routes.tsx";
import { registerPageViewRoutes } from "./pageview-routes.tsx";
import { registerOGRoutes } from "./og-routes.tsx";

const app = new Hono();

// ── Suppress Deno-level "connection closed" errors ──
// These fire *after* our handler returns, when Deno's respondWith() tries to
// write bytes to an already-closed client socket. Neither the try/catch in our
// handler nor Deno.serve's onError can intercept them — they surface as
// unhandled rejections. Totally benign (client navigated away).
globalThis.addEventListener('unhandledrejection', (e) => {
  const msg = String(e.reason);
  if (
    e.reason?.name === 'Http' ||
    /connection closed/i.test(msg) ||
    /connection error/i.test(msg)
  ) {
    e.preventDefault();          // swallow — nothing to do
  }
});

// ── Patch console.error to mute Deno runtime transport noise ──
// Deno's internal `mapped()` in ext:runtime/http.js catches respondWith()
// failures and logs them via console.error *before* any app-level handler.
// This is purely cosmetic — the client already left.
const _nativeConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const first = args[0];
  if (
    first instanceof Error &&
    (first.name === 'Http' || /connection closed/i.test(first.message))
  ) {
    return; // silently drop
  }
  if (typeof first === 'string' && /connection closed/i.test(first)) {
    return;
  }
  _nativeConsoleError.apply(console, args);
};

// Logging
app.use('*', logger(console.log));

// CORS
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-client-info", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
app.get("/make-server-7b092b69/health", (c) => c.json({ status: "ok" }));

// Register all route modules
registerRegistryRoutes(app);
registerProductRoutes(app);
registerRuleRoutes(app);
registerClickRoutes(app);
registerSearchRoutes(app);
registerPageViewRoutes(app);
registerOGRoutes(app);

// Wrap Hono's fetch handler to swallow Deno-level "connection closed" errors.
// These fire when the client navigates away mid-response — totally benign.
const handler = async (req: Request, info?: Deno.ServeHandlerInfo) => {
  try {
    return await app.fetch(req, info);
  } catch (err: any) {
    if (err?.name === 'Http' || /connection closed/i.test(String(err))) {
      // Client disconnected — nothing we can do, return empty 499
      return new Response(null, { status: 499 });
    }
    console.log(`[Server] Unhandled fetch error: ${err}`);
    return new Response('Internal Server Error', { status: 500 });
  }
};

Deno.serve({
  onError(error) {
    if (error?.name === 'Http' || /connection closed/i.test(String(error))) {
      return new Response(null, { status: 499 });
    }
    console.log(`[Server] Unhandled error: ${error}`);
    return new Response('Internal Server Error', { status: 500 });
  },
}, handler);