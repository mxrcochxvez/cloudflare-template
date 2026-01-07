import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";

import styles from "~/styles/tailwind.css?url";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "Hexacomb | Building Your Digital Hive" },
  { 
    name: "description", 
    content: "Hexacomb builds efficient, scalable technology solutions for small businesses. Web development, cloud solutions, and AI integration." 
  },
  // Open Graph
  { property: "og:type", content: "website" },
  { property: "og:title", content: "Hexacomb" },
  { property: "og:description", content: "Building efficient, scalable technology solutions for your business." },
  // Twitter Card
  { name: "twitter:card", content: "summary_large_image" },
  // Theme color (honey gold)
  { name: "theme-color", content: "#f59e0b" },
];

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
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
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
