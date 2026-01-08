/**
 * Database Schema for Cloudflare Template
 * 
 * This file defines your database tables using Drizzle ORM.
 * Drizzle works with Cloudflare D1 (SQLite-compatible).
 * 
 * HOW TO USE:
 * 1. Define your tables in this file
 * 2. Run `npm run db:generate` to generate migrations
 * 3. Run `npm run db:migrate:prod` to apply migrations to production
 * 
 * IMPORTANT: Before using the database, you must:
 * 1. Create a D1 database: `wrangler d1 create your-db-name`
 * 2. Update wrangler.toml with your database_id
 * 
 * For more info: https://orm.drizzle.team/docs/sql-schema-declaration
 */

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================================================
// EXAMPLE: Users Table
// ============================================================================
/**
 * Users table - stores user accounts
 * 
 * Usage:
 *   import { users } from "~/db/schema";
 *   const allUsers = await db.select().from(users);
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Basic info
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  
  // Auth
  passwordHash: text("password_hash"), // For email/password auth
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  
  // Timestamps
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================================
// EXAMPLE: Posts Table (demonstrates relationships)
// ============================================================================
/**
 * Posts table - stores blog posts or content
 * 
 * This demonstrates a foreign key relationship to users.
 */
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  
  // Status
  status: text("status", { enum: ["draft", "published", "archived"] })
    .default("draft")
    .notNull(),
  
  // Relationship - references users.id
  authorId: integer("author_id").references(() => users.id),
  
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  
  // Timestamps
  publishedAt: text("published_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================================
// EXAMPLE: Settings Table (key-value store pattern)
// ============================================================================
/**
 * Settings table - stores application configuration
 * 
 * Good for site-wide settings like site name, theme, etc.
 */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
// These provide TypeScript types for your tables

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// ============================================================================
// QUERYING EXAMPLES (for your reference, not executed)
// ============================================================================
/*
import { db } from "~/lib/db.server";
import { users, posts, settings } from "~/db/schema";
import { eq, desc, like } from "drizzle-orm";

// Select all users
const allUsers = await db.select().from(users);

// Select user by id
const user = await db.select().from(users).where(eq(users.id, 1));

// Insert a new user
const newUser = await db.insert(users).values({
  email: "user@example.com",
  name: "John Doe",
}).returning();

// Update a user
await db.update(users)
  .set({ name: "Jane Doe" })
  .where(eq(users.id, 1));

// Delete a user
await db.delete(users).where(eq(users.id, 1));

// Join posts with authors
const postsWithAuthors = await db
  .select({
    post: posts,
    author: users,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .orderBy(desc(posts.createdAt));

// Search posts
const searchResults = await db
  .select()
  .from(posts)
  .where(like(posts.title, '%search term%'));
*/
