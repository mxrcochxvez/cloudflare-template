import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import styles from "~/styles/tailwind.css?url";
import { Navbar } from "~/components/ui/navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Navbar githubUrl="https://github.com/mxrcochxvez/cloudflare-template" />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Simple footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ using Remix, Cloudflare, and shadcn/ui</p>
      </footer>
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
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <p className="text-7xl font-bold text-primary mb-4">{status}</p>
          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{message}</p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go back home
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
