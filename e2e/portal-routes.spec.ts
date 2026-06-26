import { test, expect } from "@playwright/test";

const PORTAL_ROUTES = [
  "/admissions/dashboard",
  "/careers/dashboard",
  "/student",
  "/student/attendance",
  "/student/marks",
] as const;

for (const path of PORTAL_ROUTES) {
  test(`PRT: unauthenticated redirect from ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login/);
  });
}

test("PRT: MFA page loads without auth", async ({ page }) => {
  const res = await page.goto("/mfa");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator("body")).toBeVisible();
});

test("careers apply requires login", async ({ page }) => {
  await page.goto("/careers/apply/00000000-0000-0000-0000-000000000001");
  await expect(page).toHaveURL(/\/login/);
});
