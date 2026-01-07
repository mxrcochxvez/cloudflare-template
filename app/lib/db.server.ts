import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../db/schema";

export * from "../../db/schema";

/**
 * Create a Drizzle ORM instance from a D1 database binding
 */
export function getDb(db: D1Database) {
  return drizzle(db, { schema });
}
