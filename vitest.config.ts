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
  ssr: {
    external: ["bun:sqlite"],
  },
  test: {
    environment: "happy-dom",
    globals: true,
    fileParallelism: false,
    server: {
      deps: {
        external: ["bun:sqlite"],
      },
    },
  },
});
