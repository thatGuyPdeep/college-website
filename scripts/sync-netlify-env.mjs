#!/usr/bin/env node
/**
 * Push local .env to Netlify (production URL override).
 * Usage: node scripts/sync-netlify-env.mjs
 */
import { execSync } from "child_process";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const PROJECT_ROOT = process.cwd();
const PRODUCTION_SITE_URL = "https://calm-gumdrop-263663.netlify.app";
const importFile = join(PROJECT_ROOT, ".env.netlify");

function parseEnvFile(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

const local = parseEnvFile(join(PROJECT_ROOT, ".env"));
const lines = Object.entries({ ...local, NEXT_PUBLIC_SITE_URL: PRODUCTION_SITE_URL })
  .filter(([, v]) => v)
  .map(([k, v]) => `${k}=${v}`);
writeFileSync(importFile, lines.join("\n") + "\n");

try {
  execSync("npx netlify-cli env:import .env.netlify", {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    shell: true,
  });
  execSync("npx netlify-cli deploy --trigger --prod", {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    shell: true,
  });
} finally {
  try {
    unlinkSync(importFile);
  } catch {}
}
