import { test, expect } from "./fixtures";

test("navigation works at desktop and mobile sizes with correct focus and state", async ({
  page,
  isMobile,
}) => {
  await page.goto("/products");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  const desktop = page.getByRole("navigation", { name: "Main navigation" });
  if (isMobile) {
    await expect(desktop).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobile).toBeVisible();
    await expect(mobile.getByRole("link", { name: "Products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await mobile.getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await mobile.getByRole("link", { name: "Products" }).focus();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(mobile).toHaveCount(0);
  } else {
    await expect(toggle).toBeHidden();
    await expect(desktop.getByRole("link", { name: "Products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await desktop.getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(desktop.getByRole("link", { name: "Services" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("One team. Many moving parts.");
});

test("unknown routes return 404 and the home link recovers navigation", async ({ page }) => {
  const response = await page.goto("/not-a-real-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("region", { name: "Supreme Energy hero slideshow" })).toBeVisible();
});
