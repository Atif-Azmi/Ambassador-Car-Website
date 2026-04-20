import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Windows/ESM compatibility ke liye __dirname define karna
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);

export default defineConfig({
  // Base path setup
  base: process.env.BASE_PATH ?? "/",

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      // "@" ab seedha aapke "src" folder ko point karega
      "@": path.resolve(__dirname, "src"),
      // "@assets" ab "src/assets" ko point karega
      "@assets": path.resolve(__dirname, "src/assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  // Root directory ko current folder par set kiya gaya hai
  root: process.cwd(),

  build: {
    // Vercel ke liye standard output directory
    outDir: "dist",
    emptyOutDir: true,
    // Source maps development ke liye help karte hain
    sourcemap: true,
  },

  server: {
    port,
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
  },
});