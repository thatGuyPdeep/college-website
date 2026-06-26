import { test, expect } from "@playwright/test";
import { expectMainVisible } from "./helpers";

const EXAMINATION_PAGES = [
  { path: "/examination", title: /Examination/i },
  { path: "/examination/notices", title: /Notice|Examination/i },
  { path: "/examination/results", title: /Result|Examination/i },
  { path: "/examination/timetables", title: /Time|Examination/i },
  { path: "/examination/forms", title: /Form|Examination/i },
  { path: "/admissions/seats", title: /Seat|Admission/i },
  { path: "/iqac", title: /IQAC/i },
] as const;

for (const item of EXAMINATION_PAGES) {
  test(`EXM: loads ${item.path}`, async ({ page }) => {
    const res = await page.goto(item.path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(item.title);
    await expectMainVisible(page);
  });
}

test("EXM: admin content redirects unauthenticated users", async ({ page }) => {
  await page.goto("/admin/content");
  await expect(page).toHaveURL(/\/login/);
});

test("news index loads", async ({ page }) => {
  await page.goto("/news");
  await expect(page).toHaveTitle(/News|Notice/i);
});

test("faculty directory loads", async ({ page }) => {
  await page.goto("/faculty");
  await expect(page).toHaveTitle(/Faculty/i);
});
