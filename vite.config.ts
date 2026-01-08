import {
  vitePlugin as remix,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import AutoImport from "unplugin-auto-import/vite";

declare module "@remix-run/cloudflare" {
  interface Future {
    // v3_singleFetch: true;
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
        v3_singleFetch: false,
        v3_lazyRouteDiscovery: false,
      },
    }),
    tsconfigPaths(),
    AutoImport({
      imports: [
        // React
        {
          react: ["useState", "useEffect", "useCallback", "useMemo", "useRef", "forwardRef"],
        },
      ],
      // Custom imports for UI components
      dirs: [
        "./app/components/ui",
      ],
      dts: "./app/auto-imports.d.ts", // TypeScript declaration file
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
      },
    }),
  ],
  base: process.env.GH_PAGES === "true" ? "/cloudflare-template/" : "/",
  build: {
    minify: true,
  },
});
