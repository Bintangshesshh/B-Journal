import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "pitch-black": "#0A0A0A",
        "liverpool-red": "#C8102E",
        "pure-white": "#FFFFFF",
        "paper": "#f4f0ec",
        "stadium-grey": "#F4F4F5",
        "secondary": "#5d5f5f",
        "tertiary": "#4d4c4c",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#281717",
        "on-primary": "#ffffff",
      },
      fontFamily: {
        "brutalist": ["var(--font-space-grotesk)", "sans-serif"],
        "label-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "label-lg": ["14px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "1.2", fontWeight: "700" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "800" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
};
export default config;
