import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./themes/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary, #b45309)",
        accent: "var(--color-accent, #b45309)",
        background: "var(--color-bg, #ffffff)",
        ink: "var(--color-ink, #1c1917)"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "-apple-system", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
