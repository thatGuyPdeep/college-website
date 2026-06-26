import { test, expect } from "@playwright/test";

test("apply page shows wizard or login prompt", async ({ page }) => {
  await page.goto("/admissions/apply");

  const onLogin = /\/login/.test(page.url());
  if (!onLogin) {
    await expect(page).toHaveTitle(/Apply|Application/i);
  }

  const loginLink = page.getByRole("link", { name: /log in|sign in/i });
  const emailField = page.getByLabel(/email/i);
  const stepper = page.getByText(/Personal|Academic|Programme/i);

  await expect(loginLink.or(emailField).or(stepper).first()).toBeVisible({ timeout: 15_000 });
});

test("apply page step labels or login form", async ({ page }) => {
  await page.goto("/admissions/apply");

  if (/\/login/.test(page.url())) {
    await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: 10_000 });
    return;
  }

  const steps = ["Personal", "Academic", "Programme", "Documents", "Review"];
  for (const label of steps) {
    await expect(page.getByText(label, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  }
});
