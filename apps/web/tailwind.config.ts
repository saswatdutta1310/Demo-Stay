
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
        cream: "var(--c-cream, #FFF9F3)",
        satin: "var(--c-satin, #FFFEFD)",
        pebble: "var(--c-pebble-grey, #EEE8E1)",
        "pebble-grey": "var(--c-pebble-grey, #EEE8E1)",
        silt: "var(--c-silt, #BBB2A6)",
        wood: "var(--c-wood-grey, #74706A)",
        "wood-grey": "var(--c-wood-grey, #74706A)",
        mb: {
          10: "var(--c-mb-10, #151D25)",
          15: "var(--c-mb-15, #293A49)",
          20: "var(--c-mb-20, #41525F)",
          30: "var(--c-mb-30, #5D7587)",
          40: "var(--c-mb-40, #96ACBD)",
          50: "var(--c-mb-50, #CDDBE5)"
        },
        midnight: {
          DEFAULT: "var(--c-mb-10, #151D25)",
          10: "var(--c-mb-10, #151D25)",
          15: "var(--c-mb-15, #293A49)",
          20: "var(--c-mb-20, #41525F)",
          30: "var(--c-mb-30, #5D7587)",
          40: "var(--c-mb-40, #96ACBD)",
          50: "var(--c-mb-50, #CDDBE5)"
        },
        fg: {
          10: "var(--c-fg-10, #35403B)",
          20: "var(--c-fg-20, #697A72)",
          30: "var(--c-fg-30, #A1B2AA)",
          40: "var(--c-fg-40, #B6C8C0)",
          50: "var(--c-fg-50, #D2DFD9)"
        },
        forest: {
          DEFAULT: "var(--c-fg-10, #35403B)",
          10: "var(--c-fg-10, #35403B)",
          20: "var(--c-fg-20, #697A72)",
          30: "var(--c-fg-30, #A1B2AA)",
          40: "var(--c-fg-40, #B6C8C0)",
          50: "var(--c-fg-50, #D2DFD9)"
        },
        vg: {
          10: "var(--c-vg-10, #8C3F1A)",
          20: "var(--c-vg-20, #9C4633)",
          25: "var(--c-vg-25, #A85422)",
          30: "var(--c-vg-30, #B6522E)",
          40: "var(--c-vg-40, #E37F3D)",
          50: "var(--c-vg-50, #EF9D54)"
        },
        terracotta: {
          DEFAULT: "var(--c-vg-30, #B6522E)",
          10: "var(--c-vg-10, #8C3F1A)",
          20: "var(--c-vg-20, #9C4633)",
          25: "var(--c-vg-25, #A85422)",
          30: "var(--c-vg-30, #B6522E)",
          40: "var(--c-vg-40, #E37F3D)",
          50: "var(--c-vg-50, #EF9D54)"
        },
        amber: {
          50: "var(--c-w-50, #F6BC2F)",
          80: "var(--c-w-80, #FFE29D)",
          100: "var(--c-w-100, #FFF4DA)"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Marcellus", "Cormorant Garamond", "Georgia", "serif"],
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"]
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-smooth": "cubic-bezier(0.65, 0, 0.35, 1)",
        snappy: "cubic-bezier(0.25, 1, 0.5, 1)"
      },
      maxWidth: {
        estate: "1440px"
      }
    }
  },
  plugins: []
};

export default config;
