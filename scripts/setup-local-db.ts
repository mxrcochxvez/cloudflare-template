/**
 * Local SQLite database setup for testing the setup wizard
 * 
 * This creates a SQLite database file and runs migrations
 * so you can test the full setup flow without Cloudflare.
 * 
 * Run with: npm run setup:local
 */

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), ".local-dev.db");

console.log("🗄️  Setting up local SQLite database...\n");

// Create/open database
const db = new Database(DB_PATH);

// Create tables
console.log("📦 Creating tables...");

db.exec(`
  CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL DEFAULT 'My Business',
    tagline TEXT,
    description TEXT,
    industry TEXT,
    template_id TEXT DEFAULT 'modern',
    hero_headline TEXT,
    hero_subheadline TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#0ea5e9',
    secondary_color TEXT DEFAULT '#1e293b',
    email TEXT,
    phone TEXT,
    address TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    resend_configured INTEGER DEFAULT 0,
    notification_email TEXT,
    product_schema TEXT,
    setup_complete INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL,
    image_url TEXT,
    category TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("✅ Tables created!\n");

// Check if config exists, if so reset it for testing
const existing = db.prepare("SELECT * FROM site_config LIMIT 1").get();
if (existing) {
  console.log("🔄 Resetting existing config for fresh setup test...");
  db.prepare("DELETE FROM site_config").run();
}

db.close();

console.log(`✅ Local database ready at: ${DB_PATH}`);
console.log("\n📋 To test the setup wizard:");
console.log("   1. Run: npm run dev:local");
console.log("   2. Visit: http://localhost:5173/setup");
console.log("");
