import { test, expect } from "@playwright/test";

test("apply page shows wizard or login prompt", async ({ page }) => {
  await page.goto("/admissions/apply");
  await expect(page).toHaveTitle(/Apply|Application/i);

  const loginLink = page.getByRole("link", { name: /log in|sign in/i });
  const stepper = page.getByText(/Personal|Academic|Programme/i);

  await expect(loginLink.or(stepper).first()).toBeVisible({ timeout: 15_000 });
});

test("apply page step labels are accessible", async ({ page }) => {
  await page.goto("/admissions/apply");
  const steps = ["Personal", "Academic", "Programme", "Documents", "Review"];
  for (const label of steps) {
    await expect(page.getByText(label, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  }
});
