import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import fileURLToPath from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath.fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": rootDir,
      "@": rootDir,
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
  },
});
