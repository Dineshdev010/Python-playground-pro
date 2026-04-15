import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: false,
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["logo.png"],
        manifestFilename: "manifest.json",
        manifest: {
          id: "/",
          name: "PyMaster",
          short_name: "PyMaster",
          description: "Learn Python with lessons, practice problems, quick prep, and a built-in browser compiler.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          display_override: ["standalone", "minimal-ui", "browser"],
          background_color: "#0a0c10",
          theme_color: "#0a0c10",
          icons: [
            {
              src: "/logo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit for Monaco workers
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallbackDenylist: [/^\/api\//],
          globIgnores: ["**/pyodide/**"],
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/pyodide/"),
              handler: "CacheFirst",
              options: {
                cacheName: "pyodide-runtime-cache",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
        // Dev service-worker caching can keep old JS around and cause errors like "X is not defined".
        devOptions: {
          enabled: !isDev,
        },
      }),
      compression({ algorithms: ["gzip", "brotliCompress"], exclude: /\.(png|jpg|webp|woff2|gz|br)$/i }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React
            "vendor-react":    ["react", "react-dom", "react-router-dom"],
            // Monaco Editor (~3MB) — lazy loaded but pre-split for better caching
            "vendor-monaco":   ["@monaco-editor/react", "monaco-editor"],
            // Charts
            "vendor-recharts": ["recharts"],
            // Supabase
            "vendor-supabase": ["@supabase/supabase-js"],
            // UI components
            "vendor-ui":       ["@radix-ui/react-tabs", "@radix-ui/react-dialog", "@radix-ui/react-toast", "framer-motion"],
          },
        },
      },
      // Warn at 750kb instead of 500kb to reduce noise; Monaco chunks are expected to be large
      chunkSizeWarningLimit: 750,
    },
  };
});
