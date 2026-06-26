#!/usr/bin/env node
import nodemailer from "nodemailer";
import "dotenv/config";

const to = process.argv[2] ?? process.env.SMTP_USER;
const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD?.trim();
const port = Number(process.env.SMTP_PORT?.trim() || "587");
const from =
  process.env.SMTP_FROM?.trim() ||
  `RMVK College Narayanpur <${user}>`;

if (!host || !user || !pass || !to) {
  console.error("Missing SMTP_* in .env or recipient argument");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: { user, pass },
});

try {
  await transport.sendMail({
    from,
    to,
    subject: "RMVK College — SMTP test",
    html: "<p>Gmail SMTP is working for the college website.</p>",
  });
  console.log("SMTP test sent to", to);
} catch (err) {
  console.error("SMTP failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}
