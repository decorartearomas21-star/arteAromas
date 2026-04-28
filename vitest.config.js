import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  test: {
    environment: "jsdom",
    pool: "threads",
    maxWorkers: 1,
    setupFiles: ["./test/setup.js"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage-vitest",
      cleanOnRerun: false,
      reporter: ["text", "text-summary"],
      include: [
        "src/utils/**/*.js",
        "src/lib/**/*.js",
        "src/app/actions/**/*.js",
        "src/app/artesao/action.js",
        "src/middleware.js",
      ],
      exclude: ["src/app/fonts.js", "node_modules/**", ".next/**"],
    },
  },
});
