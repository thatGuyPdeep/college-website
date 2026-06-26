#!/usr/bin/env node
/**
 * Push .env to Netlify (production URL override). Does not auto-deploy.
 * Usage: node scripts/push-netlify-env.mjs
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
const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "RESEND_API_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "ADMIN_BOOTSTRAP_EMAILS",
];

const merged = { ...local, NEXT_PUBLIC_SITE_URL: PRODUCTION_SITE_URL };
const missing = required.filter((k) => !merged[k]?.trim());
if (missing.length) {
  console.error("Missing in .env:", missing.join(", "));
  process.exit(1);
}

const lines = Object.entries(merged)
  .filter(([, v]) => v)
  .map(([k, v]) => {
    const needsQuotes = /[\s<>]/.test(v) && !v.startsWith('"');
    return needsQuotes ? `${k}="${v.replace(/"/g, '\\"')}"` : `${k}=${v}`;
  });

writeFileSync(importFile, lines.join("\n") + "\n");
console.log("Importing", lines.length, "variables to Netlify (production context)…");

try {
  execSync("npx netlify-cli env:import .env.netlify", {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    shell: true,
  });
  console.log("\nDone. Redeploy the site for functions to pick up new env vars:");
  console.log("  npx netlify-cli deploy --prod");
} finally {
  try {
    unlinkSync(importFile);
  } catch {}
}
