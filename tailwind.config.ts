import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vprs-black": "#0D0D0D",
        "vprs-graphite": "#2B2B2B",
        "vprs-gray": "#707070",
        "vprs-white": "#F8F8F8",
        "vprs-accent": "var(--vprs-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        vprs: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
