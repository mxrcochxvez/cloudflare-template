/**
 * Seed script for local development
 * Usage: npm run seed
 * 
 * Seeds the local D1 database with mock data
 */

import { execSync } from "child_process";
import { seedConfig, seedMenuItems, seedLeads } from "./seed-data";

const DB_NAME = "cloudflare-template-db";

// Generate SQL for seeding
function generateSeedSQL(): string {
  const statements: string[] = [];
  
  // Clear existing data
  statements.push("DELETE FROM site_config;");
  statements.push("DELETE FROM menu_items;");
  statements.push("DELETE FROM leads;");
  
  // Insert site config
  const configValues = Object.entries(seedConfig)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => {
      if (v === null) return `NULL`;
      if (typeof v === "boolean") return v ? "1" : "0";
      if (typeof v === "number") return String(v);
      return `'${String(v).replace(/'/g, "''")}'`;
    });
  
  const configCols = Object.keys(seedConfig).filter((k) => seedConfig[k as keyof typeof seedConfig] !== undefined);
  statements.push(`INSERT INTO site_config (${configCols.join(", ")}) VALUES (${configValues.join(", ")});`);
  
  // Insert menu items
  for (const item of seedMenuItems) {
    statements.push(`
      INSERT INTO menu_items (title, description, price, image_url, category, is_active, sort_order)
      VALUES (
        '${item.title}',
        '${item.description?.replace(/'/g, "''")}',
        ${item.price ?? "NULL"},
        ${item.imageUrl ? `'${item.imageUrl}'` : "NULL"},
        '${item.category}',
        ${item.isActive ? 1 : 0},
        ${item.sortOrder}
      );
    `);
  }
  
  // Insert leads
  for (const lead of seedLeads) {
    statements.push(`
      INSERT INTO leads (name, email, phone, message, status)
      VALUES (
        '${lead.name}',
        '${lead.email}',
        ${lead.phone ? `'${lead.phone}'` : "NULL"},
        '${lead.message.replace(/'/g, "''")}',
        '${lead.status}'
      );
    `);
  }
  
  return statements.join("\n");
}

async function main() {
  console.log("🌱 Seeding local database...\n");
  
  const sql = generateSeedSQL();
  
  // Write SQL to temp file and execute
  const fs = await import("fs");
  const path = await import("path");
  const tempFile = path.join(process.cwd(), ".seed-temp.sql");
  
  fs.writeFileSync(tempFile, sql);
  
  try {
    execSync(`wrangler d1 execute ${DB_NAME} --local --file=${tempFile}`, {
      stdio: "inherit",
    });
    console.log("\n✅ Database seeded successfully!");
    console.log("\nSeeded data:");
    console.log(`  - Site config: "${seedConfig.businessName}"`);
    console.log(`  - Menu items: ${seedMenuItems.length}`);
    console.log(`  - Leads: ${seedLeads.length}`);
  } finally {
    fs.unlinkSync(tempFile);
  }
}

main().catch(console.error);
