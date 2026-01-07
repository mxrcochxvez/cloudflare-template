import type { AppLoadContext } from "@remix-run/cloudflare";

/**
 * Cloudflare environment bindings
 * These are available via context.cloudflare.env in loaders/actions
 */
export interface Env {
  DB: D1Database;
  AI: Ai;
  ENVIRONMENT: string;
}

/**
 * Extended load context with typed Cloudflare bindings
 */
export interface CloudflareLoadContext extends AppLoadContext {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
    caches: CacheStorage;
  };
}

/**
 * Helper to get typed environment from context
 * Returns undefined for bindings not available in local dev
 */
export function getEnv(context: AppLoadContext): Env {
  const cf = (context as CloudflareLoadContext).cloudflare;
  
  if (!cf?.env) {
    // Local development without wrangler - return mock env
    console.warn("Cloudflare bindings not available. Run with 'wrangler pages dev' for full functionality.");
    return {
      DB: undefined as unknown as D1Database,
      AI: undefined as unknown as Ai,
      ENVIRONMENT: "development",
    };
  }
  
  return cf.env;
}

/**
 * Check if we're running in Cloudflare environment with bindings
 */
export function hasCloudflareBindings(context: AppLoadContext): boolean {
  const cf = (context as CloudflareLoadContext).cloudflare;
  return Boolean(cf?.env?.DB);
}
