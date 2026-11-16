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
        secondary: "var(--color-secondary, #78350f)",
        accent: "var(--color-accent, #fef3c7)"
      }
    }
  },
  plugins: []
};

export default config;
