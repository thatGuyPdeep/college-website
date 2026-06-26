import { test, expect } from "@playwright/test";
import { urlHasRedirect } from "./helpers";

/** All staff admin routes from proxy.ts — unauthenticated must → /login */
const STAFF_ADMIN_ROUTES = [
  "/admin",
  "/admin/admissions",
  "/admin/admissions/seats",
  "/admin/recruitment",
  "/admin/content",
  "/admin/examination",
  "/admin/payments",
  "/admin/erp",
  "/admin/tasks",
  "/admin/search",
  "/admin/notifications",
  "/admin/users",
  "/admin/settings",
  "/admin/audit",
  "/admin/compliance",
  "/admin/iqac",
  "/admin/ai",
  "/admin/contact",
] as const;

for (const path of STAFF_ADMIN_ROUTES) {
  test(`ADM-R: unauthenticated redirect from ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login/);
  });
}

test("ADM-R-18: staff login page loads with redirect=/admin", async ({ page }) => {
  await page.goto("/login?redirect=/admin");
  await expect(page.getByText(/Staff portal sign-in/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("login preserves redirect query", async ({ page }) => {
  await page.goto("/login?redirect=/admin/admissions");
  expect(urlHasRedirect("/admin/admissions", page.url())).toBe(true);
});

test("applicant role cannot reach admin (redirect only without session)", async ({ page }) => {
  await page.goto("/admin/admissions");
  expect(page.url()).toMatch(/\/login/);
});
