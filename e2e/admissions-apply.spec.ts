import { test, expect } from "@playwright/test";

test("apply page shows SMKV university portal notice", async ({ page }) => {
  await page.goto("/admissions/apply");

  await expect(page).toHaveTitle(/Apply|Admission/i);
  await expect(page.getByRole("heading", { name: /Apply Through Bastar University/i })).toBeVisible();
  await expect(page.getByText(/smkvbastar\.ac\.in/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Go to smkvbastar\.ac\.in/i })).toBeVisible();
});

test("apply page links to university portal externally", async ({ page }) => {
  await page.goto("/admissions/apply");

  const portalLink = page.getByRole("link", { name: /Go to smkvbastar\.ac\.in/i });
  await expect(portalLink).toHaveAttribute("href", "https://smkvbastar.ac.in");
  await expect(portalLink).toHaveAttribute("target", "_blank");
});
