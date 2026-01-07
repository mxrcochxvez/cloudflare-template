/**
 * Seed data for development/testing
 * Run with: npm run seed
 */

import type { NewSiteConfig, NewMenuItem } from "../db/schema";

export const seedConfig: NewSiteConfig = {
  businessName: "Demo Business",
  tagline: "Your success is our mission",
  description: "We provide professional services to help your business grow.",
  industry: "consulting",
  templateId: "modern",
  heroHeadline: "Transform Your Business Today",
  heroSubheadline: "We deliver results that matter. Professional solutions tailored to your needs.",
  logoUrl: null,
  primaryColor: "#0ea5e9",
  secondaryColor: "#1e293b",
  email: "hello@demo.com",
  phone: "(555) 123-4567",
  address: "123 Main Street, City, ST 12345",
  twitterUrl: "https://twitter.com",
  linkedinUrl: "https://linkedin.com",
  facebookUrl: null,
  instagramUrl: null,
  seoDescription: "Professional business services tailored to your needs. Contact us today.",
  resendConfigured: false,
  notificationEmail: null,
  productSchema: null,
  setupComplete: true,
};

export const seedMenuItems: NewMenuItem[] = [
  {
    title: "Web Development",
    description: "Custom websites and web applications built with modern technology.",
    price: null,
    imageUrl: null,
    category: "Development",
    isActive: true,
    sortOrder: 1,
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure that grows with your business.",
    price: null,
    imageUrl: null,
    category: "Infrastructure",
    isActive: true,
    sortOrder: 2,
  },
  {
    title: "Consulting",
    description: "Expert guidance to help you make the right technology decisions.",
    price: null,
    imageUrl: null,
    category: "Advisory",
    isActive: true,
    sortOrder: 3,
  },
];

export const seedLeads = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 111-2222",
    message: "I'm interested in learning more about your services.",
    status: "new" as const,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: null,
    message: "Please contact me about a custom project.",
    status: "contacted" as const,
  },
];
