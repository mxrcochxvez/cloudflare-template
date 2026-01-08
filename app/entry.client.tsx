import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

console.log("🚀 Client bundle loaded - starting hydration...");

startTransition(() => {
  try {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
      {
        onRecoverableError: (error) => {
          console.error("⚠️ Hydration recoverable error:", error);
        },
      }
    );
    console.log("✅ hydrateRoot called successfully");
  } catch (error) {
    console.error("❌ Hydration failed with error:", error);
  }
});
