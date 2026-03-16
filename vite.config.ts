import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      babel: {
        plugins: [],
        compact: false,
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
    esbuildOptions: {
      target: "es2020",
      define: {
        // ✅ تم تصحيح هذا السطر ليقبله esbuild
        __REACT_DEVTOOLS_GLOBAL_HOOK__: '{"isDisabled":true}',
      },
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          motion: ["motion"],
          "ui-vendor": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          charts: ["recharts"],
          icons: ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: true,
      protocol: "ws",
    },
  },
  define: {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: "undefined",
  },
});
