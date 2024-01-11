import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [require("@tailwindcss/container-queries")],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        text: "rgb(var(--text) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        shadow: "rgb(var(--shadow) / <alpha-value>)",
      },
    },
    fontSize: {
      sm: "0.750rem",
      base: "1rem",
      xl: "1.333rem",
      "2xl": "1.777rem",
      "3xl": "2.369rem",
      "4xl": "3.158rem",
      "5xl": "4.210rem",
    },
    fontFamily: {
      heading: "Proza Libre",
      body: "Proza Libre",
    },
    fontWeight: {
      normal: "400",
      bold: "700",
    },
  },
};
export default config;
