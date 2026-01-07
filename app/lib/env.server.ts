import type { AppLoadContext } from "@remix-run/cloudflare";
import { localD1, isLocalDevMode } from "./local-db.server";

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
 * In local dev mode (LOCAL_DEV=true), returns local SQLite DB
 */
export function getEnv(context: AppLoadContext): Env {
  // Check for local dev mode first
  if (isLocalDevMode()) {
    console.log("📦 Local SQLite mode: Using .local-dev.db");
    return {
      DB: localD1,
      AI: undefined as unknown as Ai,
      ENVIRONMENT: "development",
    };
  }
  
  const cf = (context as CloudflareLoadContext).cloudflare;
  
  if (!cf?.env) {
    // Local development without wrangler - return mock env (no DB)
    console.warn("Cloudflare bindings not available. Run with 'npm run setup' to test with local SQLite.");
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
  if (isLocalDevMode()) return true; // Local SQLite counts as "having DB"
  const cf = (context as CloudflareLoadContext).cloudflare;
  return Boolean(cf?.env?.DB);
}
