/**
 * Lighthouse CI — run against a live server (npm start).
 * Usage: npm run lighthouse
 */
import { execSync } from "node:child_process";

const BASE = process.env.LHCI_BASE_URL ?? "http://localhost:3000";

const URLS = [
  "/",
  "/about",
  "/admissions/apply",
  "/disclosure",
].map((p) => `${BASE.replace(/\/$/, "")}${p}`);

console.log("Lighthouse URLs:", URLs.join(", "));

execSync(`npx lhci collect --config=lighthouserc.cjs ${URLS.map((u) => `--url="${u}"`).join(" ")}`, {
  stdio: "inherit",
  env: process.env,
});

execSync("npx lhci assert --config=lighthouserc.cjs", {
  stdio: "inherit",
  env: process.env,
});

console.log("Lighthouse checks passed.");
