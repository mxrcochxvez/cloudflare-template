/**
 * Local SQLite adapter for development
 * Wraps better-sqlite3 to mimic D1Database interface
 */

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), ".local-dev.db");

let localDb: Database.Database | null = null;

function getLocalDb(): Database.Database {
  if (!localDb) {
    localDb = new Database(DB_PATH);
  }
  return localDb;
}

/**
 * D1-compatible interface for local SQLite
 * Note: This is a minimal implementation for dev testing
 */
export const localD1 = {
  prepare(query: string) {
    const db = getLocalDb();
    const stmt = db.prepare(query);
    
    return {
      bind(...params: unknown[]) {
        return {
          async first<T = unknown>(): Promise<T | null> {
            try {
              return stmt.get(...params) as T || null;
            } catch {
              return null;
            }
          },
          async all<T = unknown>() {
            try {
              const results = stmt.all(...params) as T[];
              return { results, success: true as const, meta: {} };
            } catch {
              return { results: [] as T[], success: true as const, meta: {} };
            }
          },
          async run() {
            try {
              const info = stmt.run(...params);
              return { 
                results: [], 
                success: true as const, 
                meta: { 
                  changes: info.changes,
                  last_row_id: info.lastInsertRowid as number,
                } 
              };
            } catch (e) {
              console.error("Local DB error:", e);
              return { results: [], success: true as const, meta: {} };
            }
          },
          async raw<T = unknown>() {
            try {
              return stmt.raw().all(...params) as T[];
            } catch {
              return [] as T[];
            }
          },
        };
      },
      async first<T = unknown>(): Promise<T | null> {
        try {
          return stmt.get() as T || null;
        } catch {
          return null;
        }
      },
      async all<T = unknown>() {
        try {
          const results = stmt.all() as T[];
          return { results, success: true as const, meta: {} };
        } catch {
          return { results: [] as T[], success: true as const, meta: {} };
        }
      },
      async run() {
        try {
          const info = stmt.run();
          return { 
            results: [], 
            success: true as const, 
            meta: { changes: info.changes } 
          };
        } catch {
          return { results: [], success: true as const, meta: {} };
        }
      },
      async raw<T = unknown>() {
        try {
          return stmt.raw().all() as T[];
        } catch {
          return [] as T[];
        }
      },
    };
  },
  async dump(): Promise<ArrayBuffer> {
    throw new Error("dump() not implemented in local mode");
  },
  async batch(statements: unknown[]) {
    const results = [];
    for (const stmt of statements) {
      if (stmt && typeof stmt === "object" && "all" in stmt) {
        results.push(await (stmt as any).all());
      }
    }
    return results;
  },
  async exec(query: string) {
    const db = getLocalDb();
    try {
      db.exec(query);
      return { count: 1, duration: 0 };
    } catch {
      return { count: 0, duration: 0 };
    }
  },
} as unknown as D1Database;

export function isLocalDevMode(): boolean {
  return process.env.LOCAL_DEV === "true";
}
