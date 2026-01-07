import { createContext, useContext, type ReactNode } from "react";
import type { SiteConfig } from "~/lib/db.server";

/**
 * Branding configuration exposed to components
 */
export interface BrandingConfig {
  // Business
  businessName: string;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  
  // Template
  templateId: string;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  
  // Branding
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  
  // Contact
  email: string | null;
  phone: string | null;
  address: string | null;
  
  // Social
  twitterUrl: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  
  // SEO
  seoDescription: string | null;
  
  // State
  setupComplete: boolean;
}

/**
 * Default branding when no config exists
 */
export const defaultBranding: BrandingConfig = {
  businessName: "My Business",
  tagline: null,
  description: null,
  industry: null,
  templateId: "modern",
  heroHeadline: null,
  heroSubheadline: null,
  logoUrl: null,
  primaryColor: "#0ea5e9",
  secondaryColor: "#1e293b",
  email: null,
  phone: null,
  address: null,
  twitterUrl: null,
  linkedinUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  seoDescription: null,
  setupComplete: false,
};

/**
 * Convert SiteConfig from DB to BrandingConfig
 */
export function configToBranding(config: SiteConfig | null): BrandingConfig {
  if (!config) return defaultBranding;
  
  return {
    businessName: config.businessName,
    tagline: config.tagline,
    description: config.description,
    industry: config.industry,
    templateId: config.templateId || "modern",
    heroHeadline: config.heroHeadline,
    heroSubheadline: config.heroSubheadline,
    logoUrl: config.logoUrl,
    primaryColor: config.primaryColor || "#0ea5e9",
    secondaryColor: config.secondaryColor || "#1e293b",
    email: config.email,
    phone: config.phone,
    address: config.address,
    twitterUrl: config.twitterUrl,
    linkedinUrl: config.linkedinUrl,
    facebookUrl: config.facebookUrl,
    instagramUrl: config.instagramUrl,
    seoDescription: config.seoDescription,
    setupComplete: config.setupComplete ?? false,
  };
}

// Context
const BrandingContext = createContext<BrandingConfig | null>(null);

/**
 * Provider component for branding context
 */
export function BrandingProvider({ 
  children, 
  config 
}: { 
  children: ReactNode; 
  config: BrandingConfig;
}) {
  return (
    <BrandingContext.Provider value={config}>
      {children}
    </BrandingContext.Provider>
  );
}

/**
 * Hook to access branding configuration
 */
export function useBranding(): BrandingConfig {
  const context = useContext(BrandingContext);
  if (!context) {
    // Return defaults if used outside provider (e.g., during setup)
    return defaultBranding;
  }
  return context;
}
