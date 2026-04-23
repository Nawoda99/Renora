import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proxyTarget =
  process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5174";

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
        target: proxyTarget,
        changeOrigin: true,
      },
      "/media": {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
});
