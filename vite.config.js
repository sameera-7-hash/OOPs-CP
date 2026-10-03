import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proxies /api/* to the C++ patient_server (see patient_dashboard/backend,
// run with `patient_server` listening on :8080) so the frontend can call
// same-origin relative paths and avoid dealing with CORS in dev.
export default defineConfig({
  plugins: [tailwindcss()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
