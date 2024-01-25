import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
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
