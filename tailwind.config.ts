import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary color uses CSS custom property for dynamic theming
        primary: {
          50: "color-mix(in srgb, var(--color-primary, #0ea5e9) 5%, white)",
          100: "color-mix(in srgb, var(--color-primary, #0ea5e9) 10%, white)",
          200: "color-mix(in srgb, var(--color-primary, #0ea5e9) 20%, white)",
          300: "color-mix(in srgb, var(--color-primary, #0ea5e9) 40%, white)",
          400: "color-mix(in srgb, var(--color-primary, #0ea5e9) 60%, white)",
          500: "var(--color-primary, #0ea5e9)",
          600: "color-mix(in srgb, var(--color-primary, #0ea5e9) 90%, black)",
          700: "color-mix(in srgb, var(--color-primary, #0ea5e9) 80%, black)",
          800: "color-mix(in srgb, var(--color-primary, #0ea5e9) 70%, black)",
          900: "color-mix(in srgb, var(--color-primary, #0ea5e9) 60%, black)",
          950: "color-mix(in srgb, var(--color-primary, #0ea5e9) 40%, black)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
