import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Site Configuration Table
 * Stores all business branding, contact info, and settings
 */
export const siteConfig = sqliteTable("site_config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Business Identity
  businessName: text("business_name").notNull().default("My Business"),
  tagline: text("tagline"),
  description: text("description"),
  industry: text("industry"), // consulting, restaurant, retail, agency, other
  
  // Template & Layout
  templateId: text("template_id").default("modern"),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  
  // Branding
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: text("primary_color").default("#0ea5e9"),
  secondaryColor: text("secondary_color").default("#1e293b"),
  
  // Contact
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  
  // Social Links
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  
  // SEO
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  
  // Email (Resend)
  resendConfigured: integer("resend_configured", { mode: "boolean" }).default(false),
  notificationEmail: text("notification_email"),
  
  // Dynamic Schema (for retail)
  productSchema: text("product_schema"), // JSON string of custom fields
  
  // Setup State
  setupComplete: integer("setup_complete", { mode: "boolean" }).default(false),
  
  // Timestamps
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Menu Items / Products Table
 * For services, products, or menu items
 */
export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price"),
  imageUrl: text("image_url"),
  category: text("category"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  metadata: text("metadata"), // JSON for custom fields (retail)
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Leads Table
 * Contact form submissions
 */
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "contacted", "converted", "archived"] }).default("new").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Type exports
export type SiteConfig = typeof siteConfig.$inferSelect;
export type NewSiteConfig = typeof siteConfig.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
