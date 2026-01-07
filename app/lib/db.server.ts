import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../../db/schema";

export type Database = DrizzleD1Database<typeof schema>;

/**
 * Creates a Drizzle ORM instance from the D1 binding
 * Use this in loaders and actions to get typed database access
 */
export function getDb(d1: D1Database): Database {
  return drizzle(d1, { schema });
}

// Re-export schema types for convenience
export * from "../../db/schema";
