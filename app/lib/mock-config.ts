/**
 * Mock configuration for local development
 * Used when running without Cloudflare bindings (npm run dev)
 * 
 * This allows testing the "finished" site experience locally
 * without needing D1 database or running the setup wizard.
 */

import type { SiteConfig, MenuItem } from "./db.server";

export const mockConfig: Partial<SiteConfig> = {
  id: 1,
  businessName: "Acme Corporation",
  tagline: "Building Tomorrow, Today",
  description: "We provide innovative solutions to help businesses thrive in the digital age.",
  industry: "technology",
  templateId: "modern",
  heroHeadline: "Transform Your Business with Technology",
  heroSubheadline: "Cutting-edge solutions that drive growth and efficiency. Let us help you reach your full potential.",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#0ea5e9",
  secondaryColor: "#1e293b",
  email: "hello@acme.example",
  phone: "(555) 123-4567",
  address: "123 Innovation Drive, Tech City, TC 12345",
  twitterUrl: "https://twitter.com/acme",
  linkedinUrl: "https://linkedin.com/company/acme",
  facebookUrl: null,
  instagramUrl: "https://instagram.com/acme",
  seoDescription: "Acme Corporation - Innovative technology solutions for modern businesses.",
  seoKeywords: "technology, innovation, digital transformation",
  resendConfigured: false,
  notificationEmail: null,
  productSchema: null,
  setupComplete: true, // Key: Always true for local dev
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    title: "Digital Transformation",
    description: "Modernize your business with cloud-native solutions and AI-powered automation.",
    price: null,
    imageUrl: null,
    category: "Consulting",
    isActive: true,
    sortOrder: 1,
    metadata: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Cloud Infrastructure",
    description: "Scalable, secure cloud architecture designed for performance and reliability.",
    price: null,
    imageUrl: null,
    category: "Development",
    isActive: true,
    sortOrder: 2,
    metadata: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Custom Software",
    description: "Bespoke applications built to solve your unique business challenges.",
    price: null,
    imageUrl: null,
    category: "Development",
    isActive: true,
    sortOrder: 3,
    metadata: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Check if we're in local development mode (no DB binding)
 */
export function isLocalDev(hasDb: boolean): boolean {
  return !hasDb;
}
