import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: false,
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) return "react-vendor";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("@monaco-editor") || id.includes("monaco-editor")) return "monaco";
            if (id.includes("jspdf") || id.includes("html2canvas")) return "pdf-export";
            if (id.includes("lucide-react")) return "icons";
            return "vendor";
          }
        },
      },
    },
  },
});
