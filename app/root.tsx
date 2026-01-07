import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";

import styles from "~/styles/tailwind.css?url";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { getEnv } from "~/lib/env.server";
import { getDb, siteConfig } from "~/lib/db.server";
import { BrandingProvider, configToBranding, defaultBranding, type BrandingConfig } from "~/context/BrandingContext";
import { mockConfig } from "~/lib/mock-config";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const branding = data?.branding || defaultBranding;
  
  return [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: `${branding.businessName}${branding.tagline ? ` | ${branding.tagline}` : ""}` },
    { 
      name: "description", 
      content: branding.seoDescription || branding.description || `Welcome to ${branding.businessName}`
    },
    { property: "og:type", content: "website" },
    { property: "og:title", content: branding.businessName },
    { property: "og:description", content: branding.seoDescription || branding.description || "" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "theme-color", content: branding.primaryColor },
  ];
};

interface LoaderData {
  branding: BrandingConfig;
  isLocalDev: boolean;
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const env = getEnv(context);
  const url = new URL(request.url);
  
  // LOCAL DEV MODE: No DB binding = use mock data, no setup redirect
  if (!env.DB) {
    console.log("📦 Local dev mode: Using mock configuration");
    return json<LoaderData>({ 
      branding: configToBranding(mockConfig as any),
      isLocalDev: true,
    });
  }
  
  // Allow setup route without redirect
  if (url.pathname.startsWith("/setup")) {
    return json<LoaderData>({ branding: defaultBranding, isLocalDev: false });
  }
  
  // PRODUCTION: Query D1 database
  const db = getDb(env.DB);
  
  try {
    const configRows = await db.select().from(siteConfig).limit(1);
    const config = configRows[0] || null;
    
    // Redirect to setup if not configured (production only)
    if (!config || !config.setupComplete) {
      return redirect("/setup");
    }
    
    return json<LoaderData>({ 
      branding: configToBranding(config),
      isLocalDev: false,
    });
  } catch (error) {
    // Table might not exist yet - redirect to setup
    console.error("Failed to load config:", error);
    return redirect("/setup");
  }
}

/**
 * Generate CSS custom properties from branding config
 */
function generateThemeStyles(branding: BrandingConfig): string {
  return `
    :root {
      --color-primary: ${branding.primaryColor};
      --color-secondary: ${branding.secondaryColor};
    }
  `;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { branding } = useLoaderData<typeof loader>();
  
  return (
    <BrandingProvider config={branding}>
      <style dangerouslySetInnerHTML={{ __html: generateThemeStyles(branding) }} />
      <Navbar />
      <main className="flex-1">
        <Outlet context={{ branding }} />
      </main>
      <Footer />
    </BrandingProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{title}</title>
      </head>
      <body className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center px-4">
          <p className="text-6xl font-bold text-primary-600 mb-4">{status}</p>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-600 mb-6">{message}</p>
          <a
            href="/"
            className="btn-primary"
          >
            Go back home
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
