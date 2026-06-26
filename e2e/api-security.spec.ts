import { test, expect } from "@playwright/test";

test("API-01: health endpoint returns JSON status", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBeLessThan(500);
  const body = await res.json();
  expect(body).toHaveProperty("status");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("checks");
});

test("API-02: cron publish-scheduled rejects without secret when CRON_SECRET set", async ({ request }) => {
  test.skip(!process.env.CRON_SECRET, "CRON_SECRET not configured in test env");
  const res = await request.get("/api/cron/publish-scheduled");
  expect(res.status()).toBe(401);
});

test("API-03: executive report requires auth", async ({ request }) => {
  const res = await request.get("/api/admin/reports/executive");
  expect([401, 403, 302, 307]).toContain(res.status());
});

test("API-04: public search API responds", async ({ request }) => {
  const res = await request.get("/api/search?q=admission");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body).toBeTruthy();
});

test("API-05: payments create-order rejects without auth", async ({ request }) => {
  const res = await request.post("/api/payments/create-order", {
    data: { application_id: "00000000-0000-0000-0000-000000000001" },
  });
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

test("API-06: robots.txt is served", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBeTruthy();
  const text = await res.text();
  expect(text.toLowerCase()).toContain("user-agent");
});
