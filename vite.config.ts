import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// $ analyser used for performance optimisation
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true, //default:false
    minify: true, // default: "esbuild"
    cssMinify: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap", // or 'sunburst', 'network'
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
