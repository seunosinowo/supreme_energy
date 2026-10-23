import { configDefaults, defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
    maxWorkers: 4,
    setupFiles: ["./tests/setup.ts"],
    reporters: ["default", "junit"],
    outputFile: { junit: "test-results/vitest.xml" },
    coverage: {
      provider: "v8",
      include: [
        "src/pages/**/*.tsx",
        "src/components/site/**/*.tsx",
        "src/lib/**/*.ts",
        "src/data/**/*.ts",
        "src/hooks/**/*.tsx",
        "src/components/ui/{button,input,carousel,menubar,dropdown-menu,context-menu}.tsx",
        "src/components/ui/_shared/**/*.ts",
        "src/components/ui/sidebar/**/*.{ts,tsx}",
      ],
      exclude: ["**/*.test.*", "src/pages/_app.tsx", "src/pages/_document.tsx"],
      thresholds: {
        statements: 90,
        branches: 75,
        functions: 80,
        lines: 90,
        "src/**/{quote,buildQuoteDoc,QuoteForm}.{ts,tsx}": {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
        "src/pages/**": { statements: 95, branches: 80, functions: 90, lines: 95, perFile: true },
      },
    },
  },
});
