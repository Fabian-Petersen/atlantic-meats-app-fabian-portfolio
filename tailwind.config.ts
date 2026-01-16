import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,css}", "./src/**/*.css"],
  theme: {
    extend: {
      colors: {
        primary: "#fcb53b",
        activelink: "#c97e00",
        secondary: "#06B6D4",
        accent: "#F59E0B",
        lightBg: "#F9FAFB",
        dark_bg: "#1d2739",
        bgdark: "#0F172A",
        bglight: "#f2f2f2",
        fontlight: "#f3f4f6",
        borderdark: "",
        font: "#001433",
        fontDark: "#1F2937",
        menuBtn: "#fef9c2 ",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      text: {
        md: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
