import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#0b0f12",
        panel: "#11181d",
        mint: "#66f5c2",
        cyan: "#48d8ff",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(102,245,194,.16), 0 24px 80px rgba(0,0,0,.38)",
      },
    },
  },
  plugins: [],
};

export default config;
