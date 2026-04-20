import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// We keep your port logic but make it safe for local use
const rawPort = process.env.PORT ?? "5173"; 
const port = Number(rawPort);

export default defineConfig({
  // Base path remains dynamic as per your previous code
  base: process.env.BASE_PATH ?? "/",
  
  plugins: [
    react(),
    tailwindcss(),
    // Note: Replit-specific plugins (cartographer/error-overlay) are removed 
    // because they cause crashes on Windows/Local.
  ],

  resolve: {
    alias: {
      // Fixed: Now points correctly to your new 'src' folder
      "@": path.resolve(__dirname, "src"),
      // Fixed: Now points to your 'src/assets' folder instead of the old Replit path
      "@assets": path.resolve(__dirname, "src/assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  // This ensures Vite looks at your current folder
  root: process.cwd(),

  build: {
    // Standard build folder
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port,
    host: "0.0.0.0",
    fs: {
      strict: false, // Changed to false to prevent 'deny' errors while testing locally
    },
  },
preview: {
  port: 5173,
  host: "0.0.0.0",
},
});