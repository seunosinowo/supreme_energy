import { readFile } from "node:fs/promises";
import type { Download, Page } from "@playwright/test";
import { products } from "../../src/data/products";
import { test, expect } from "./fixtures";

async function fillContact(page: Page) {
  await page.getByLabel("Name *", { exact: true }).fill("Ada Example");
  await page.getByLabel("Company", { exact: true }).fill("Example Logistics");
  await page.getByLabel("Phone *", { exact: true }).fill("+2349024876164");
  await page.getByLabel("Email *", { exact: true }).fill("ada@example.com");
  await page.getByLabel("City / delivery point *", { exact: true }).fill("Surulere");
  await page.getByLabel("Delivery notes", { exact: true }).fill("Call before arrival.");
}

async function readPdf(download: Download) {
  expect(download.suggestedFilename()).toMatch(/^Supreme-Energy-Quote-\d+\.pdf$/);
  expect(await download.failure()).toBeNull();
  const path = await download.path();
  if (!path) throw new Error("No downloaded PDF file");
  const content = await readFile(path);
  expect(content.subarray(0, 5).toString()).toBe("%PDF-");
  return content.toString("latin1");
}

test("product selection reaches the quote builder and downloads a real priced PDF", async ({
  page,
}) => {
  const product = products.find((p) => p.id === "lpg")!;
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/") && request.method() === "POST")
      submissions.push(request.url());
  });
  await page.goto("/products");
  await page
    .getByRole("article")
    .filter({ hasText: product.name })
    .getByRole("link", { name: "Request quote" })
    .click();
  await expect(page).toHaveURL(/\/quote\?product=lpg$/);
  await expect(page.getByRole("combobox")).toHaveValue("lpg");
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("2.5");
  const amount = (product.price * 2.5).toLocaleString("en-NG");
  await expect(page.locator("form")).toContainText(amount);
  await fillContact(page);
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const pdf = await readPdf(await downloading);
  expect(pdf).toContain("SUPREME ENERGY");
  expect(pdf).toContain("Ada Example / Example Logistics");
  expect(pdf).toContain(`NGN ${amount}`);
  expect(pdf).toContain("LPG");
  expect(pdf).toContain("Call before arrival.");
  await expect(page.getByRole("status")).toContainText("This form does not send your details");
  expect(submissions).toEqual([]);
});

test("invalid contact details and quantities show errors and can be corrected", async ({
  page,
}) => {
  await page.goto("/quote");
  const download = page.getByRole("button", { name: "Download PDF" });
  await download.click();
  await expect(page.locator("form").getByRole("alert")).toContainText("Please enter your name");
  await fillContact(page);
  await page.getByLabel("Email *", { exact: true }).fill("invalid@");
  await download.click();
  await expect(page.locator("form").getByRole("alert")).toContainText("valid email address");
  await page.getByLabel("Email *", { exact: true }).fill("ada@example.com");
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("0");
  await download.click();
  await expect(page.locator("form").getByRole("alert")).toContainText("greater than zero");
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("1");
  const downloading = page.waitForEvent("download");
  await download.click();
  await readPdf(await downloading);
  await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("downloaded");
});

test("a browser download failure leaves the form retryable", async ({ page }) => {
  // Fault injection at the browser boundary; the real form and jsPDF still run.
  await page.addInitScript(() => {
    const original = URL.createObjectURL.bind(URL);
    let failOnce = true;
    URL.createObjectURL = (blob) => {
      if (failOnce) {
        failOnce = false;
        throw new Error("Temporary download failure");
      }
      return original(blob);
    };
  });
  await page.goto("/quote");
  await fillContact(page);
  const download = page.getByRole("button", { name: "Download PDF" });
  await download.click();
  await expect(page.locator("form").getByRole("alert")).toContainText("PDF could not be generated");
  await expect(download).toBeEnabled();
  const downloading = page.waitForEvent("download");
  await download.click();
  await readPdf(await downloading);
  await expect(page.getByRole("status")).toContainText("downloaded");
});

test("adding, changing and removing products updates the estimate", async ({ page }) => {
  const diesel = products.find((p) => p.id === "ago")!;
  const petrol = products.find((p) => p.id === "pms")!;
  await page.goto("/quote?product=unknown");
  await expect(page.getByRole("combobox")).toHaveValue("ago");
  await expect(page.getByRole("button", { name: "Remove product" })).toBeDisabled();
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("2");
  await page.getByRole("button", { name: "Add product" }).click();
  await page.getByRole("combobox").nth(1).selectOption("pms");
  await page.getByRole("spinbutton", { name: "Quantity" }).nth(1).fill("3");
  await expect(page.locator("form")).toContainText(
    (diesel.price * 2 + petrol.price * 3).toLocaleString("en-NG"),
  );
  await page.getByRole("button", { name: "Remove product" }).nth(1).click();
  await expect(page.getByRole("combobox")).toHaveCount(1);
  await expect(page.locator("form")).toContainText((diesel.price * 2).toLocaleString("en-NG"));
});
