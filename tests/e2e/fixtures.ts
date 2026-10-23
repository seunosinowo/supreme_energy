import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, run) => {
    // Fonts are optional presentation resources; tests must also run offline.
    await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
    await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await run(page);
    expect(errors, "No uncaught application or hydration errors").toEqual([]);
  },
});

export { expect };
