import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fcb53b",
        activelink: "#c97e00",
        secondary: "#06B6D4",
        accent: "#F59E0B",
        lightBg: "#F9FAFB",
        darkBg: "#0F172A",
        font: "#001433",
        fontDark: "#1F2937",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
