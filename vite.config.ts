import {
  vitePlugin as remix,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      ssr: process.env.GH_PAGES !== "true", // SPA Mode only for GitHub Pages
      basename: process.env.GH_PAGES === "true" ? "/cloudflare-template/" : "/",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  base: process.env.GH_PAGES === "true" ? "/cloudflare-template/" : "/",
  build: {
    minify: true,
  },
});
