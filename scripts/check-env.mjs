#!/usr/bin/env node
/** Pre-deploy environment checklist. Usage: npm run check:env */

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

const recommended = [
  "OPENAI_API_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
];

function usesResendTestSender() {
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Ramakrishna Mission Vivekananda College <onboarding@resend.dev>";
  return from.includes("@resend.dev");
}

function hasProductionOtpEmail() {
  const verifiedResend =
    Boolean(process.env.RESEND_API_KEY?.trim()) && !usesResendTestSender();
  const smtp = Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD?.trim()
  );
  return verifiedResend || smtp;
}

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
const isProductionDeploy =
  process.env.CI === "true" ||
  process.env.VERCEL === "1" ||
  process.env.NETLIFY === "true" ||
  (!siteUrl.includes("localhost") && siteUrl.startsWith("https://"));

if (isProductionDeploy && !hasProductionOtpEmail()) {
  console.error(
    "Production OTP email is not configured. Set RESEND_API_KEY + RESEND_FROM_EMAIL (verified domain), " +
      "or SMTP_HOST / SMTP_USER / SMTP_PASSWORD."
  );
  failed = true;
}

if (siteUrl.includes("localhost") && isProductionDeploy) {
  console.warn("NEXT_PUBLIC_SITE_URL still points to localhost in a production deploy context");
}

if (!hasProductionOtpEmail()) {
  console.warn(
    "OTP email: using dev fallbacks only. For hosting, verify a Resend domain or configure SMTP."
  );
}

if (failed) {
  process.exit(1);
}

console.log("Environment check passed (required vars present).");
