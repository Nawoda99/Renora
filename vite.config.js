import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],

  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5174" || "http://192.168.12.90:5174",
        changeOrigin: true,
      },
      "/media": {
        target: "http://localhost:5174" || "http://192.168.12.90:5174",
        changeOrigin: true,
      },
    },
  },
});
