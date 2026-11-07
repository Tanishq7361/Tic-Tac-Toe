import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/@fluentui/")) return "fluentui";
          if (id.includes("/node_modules/recharts/") || id.includes("/node_modules/d3-")) return "charts";
          if (id.includes("/node_modules/framer-motion/") || id.includes("/node_modules/motion-dom/") || id.includes("/node_modules/motion-utils/")) return "motion";
          if (id.includes("/node_modules/react-dom/") || id.includes("/node_modules/react/") || id.includes("/node_modules/scheduler/")) return "react-vendor";
          return undefined;
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    strictPort: false,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    testTimeout: 20000,
  },
});
