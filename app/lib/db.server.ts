/**
 * Database Connection
 * 
 * This module provides the database connection for your Remix app.
 * It exports the Drizzle ORM instance and all schema tables.
 * 
 * SETUP REQUIRED:
 * 1. Create a D1 database: `wrangler d1 create your-db-name`
 * 2. Update wrangler.toml with your database_id
 * 3. Generate migrations: `npm run db:generate`
 * 4. Apply migrations: `npm run db:migrate` (local) or `npm run db:migrate:prod` (production)
 */

import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../db/schema";

// Re-export all schema tables and types for convenience
export * from "../../db/schema";

/**
 * Get a Drizzle ORM instance for the given D1 database binding
 * 
 * @param db - D1Database binding from Cloudflare Worker context
 * @returns Drizzle ORM instance with schema
 * 
 * @example
 * ```ts
 * export async function loader({ context }: LoaderFunctionArgs) {
 *   const db = getDb(context.cloudflare.env.DB);
 *   const users = await db.select().from(schema.users);
 *   return json({ users });
 * }
 * ```
 */
export function getDb(db: D1Database) {
  return drizzle(db, { schema });
}

/**
 * Type for the database instance
 */
export type DrizzleDb = ReturnType<typeof getDb>;
