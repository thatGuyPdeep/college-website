import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = [
  { path: "/", title: /Ramakrishna Mission Vivekananda|RMVK College|RKM Vivekananda/i },
  { path: "/about", title: /About/i },
  { path: "/about/history", title: /History/i },
  { path: "/about/awards", title: /Awards/i },
  { path: "/admissions", title: /Admission/i },
  { path: "/admissions/apply", title: /Apply|Application/i },
  { path: "/disclosure", title: /Disclosure|Mandatory/i },
  { path: "/contact", title: /Contact/i },
  { path: "/careers", title: /Career|Vacanc/i },
  { path: "/about/activities", title: /Activit|Service/i },
  { path: "/donate", title: /Donate/i },
  { path: "/about/inspiration/sri-ramakrishna", title: /Ramakrishna/i },
  { path: "/gallery", title: /Gallery/i },
];

for (const { path, title } of PUBLIC_PAGES) {
  test(`loads ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("main, [role='main'], body")).toBeVisible();
  });
}

test("about page has leadership section for disclosure", async ({ page }) => {
  await page.goto("/about#leadership");
  await expect(page.locator("#leadership")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Leadership/i })).toBeVisible();
});

test("search page accepts query", async ({ page }) => {
  await page.goto("/search?q=admission");
  await expect(page.getByText(/admission/i).first()).toBeVisible();
});

test("news RSS feed is valid XML", async ({ request }) => {
  const res = await request.get("/news/feed");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain("<rss");
  expect(body).toContain("<channel>");
});

test("contact page has grievance section", async ({ page }) => {
  await page.goto("/contact#grievance");
  await expect(page.locator("#grievance")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Grievance Redressal/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Anti-Ragging/i })).toBeVisible();
});

test("PWA manifest is served", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.name).toMatch(/Ramakrishna Mission|RKM/i);
  expect(json.theme_color).toBe("#0D2660");
});

test("admin routes redirect unauthenticated users", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/login/);
});
