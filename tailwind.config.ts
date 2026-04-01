import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#070b14",
          panel: "rgb(15 23 42 / 0.94)",
          border: "rgb(39 39 42 / 0.95)",
          muted: "#94a3b8",
          accent: "#34d399",
          /** Tag pills on marketing cards (pairs with `/opacity` utilities) */
          "800": "#1e293b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
