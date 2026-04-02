import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,css}", "./src/**/*.css"],
  theme: {
    extend: {
      // colors must be added to the index.css as a variable before becoming available
      colors: {
        // $ Theme Colors
        primary: "#fcb53b",
        bgCheck: "#C8E6C9",
        lightBg: "#F9FAFB",
        dark_bg: "#1d2739",
        bgdark: "#030712",
        // bgDark: "#101827",
        primary_dark: "#101828",
        secondary_dark: "#1b64f1",
        bglight: "#f2f2f2",

        check: "#4CAF50",
        activelink: "#c97e00",
        secondary: "#06B6D4",
        accent: "#E5E7EB",
        fontlight: "#f3f4f6",
        font: "#001433",
        fontDark: "#1F2937",
        menuBtn: "#fef9c2",
        // $ borders
        borderDark: "#364153",
        // $ Text Colors
        textDark: "#f3f4f6",
        textLight: "#001433",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      text: {
        md: "1rem",
        cxs: "0.65rem",
      },
    },
  },
  plugins: [],
};

export default config;
