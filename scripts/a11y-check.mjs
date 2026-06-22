/**
 * Accessibility smoke test — axe-core CLI against key public pages.
 * Requires the production server running (npm start).
 *
 * Usage: npm run a11y
 */

import { execSync } from "node:child_process";

const BASE = process.env.A11Y_BASE_URL ?? "http://localhost:3000";

const PAGES = [
  "/",
  "/about",
  "/about/history",
  "/about/awards",
  "/admissions/apply",
  "/disclosure",
  "/about/activities",
  "/donate",
  "/gallery",
  "/contact",
];

const urls = PAGES.map((p) => `${BASE.replace(/\/$/, "")}${p}`);

console.log("Running axe on:", urls.join(", "));

try {
  execSync(`npx axe ${urls.map((u) => `"${u}"`).join(" ")} --exit`, {
    stdio: "inherit",
    env:   process.env,
  });
  console.log("Accessibility check passed.");
} catch {
  process.exit(1);
}
