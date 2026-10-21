import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/quote.ts", "src/lib/pdf/**/*.ts", "src/components/site/QuoteForm.tsx"],
      thresholds: { statements: 90, branches: 80, functions: 90, lines: 90 },
    },
  },
});
