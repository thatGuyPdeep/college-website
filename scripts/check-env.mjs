#!/usr/bin/env node
/** Pre-deploy environment checklist. Usage: npm run check:env */

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

const recommended = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "OPENAI_API_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
];

let failed = false;

for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing required: ${key}`);
    failed = true;
  }
}

for (const key of recommended) {
  if (!process.env[key]?.trim()) {
    console.warn(`Optional not set: ${key}`);
  }
}

if (process.env.NEXT_PUBLIC_SITE_URL?.includes("localhost") && process.env.CI) {
  console.warn("NEXT_PUBLIC_SITE_URL still points to localhost in CI/production context");
}

if (failed) {
  process.exit(1);
}

console.log("Environment check passed (required vars present).");
