#!/usr/bin/env node
/**
 * Promote a user to super_admin by email.
 * Usage: node scripts/promote-super-admin.mjs thatguypdeep@gmail.com
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const email = (process.argv[2] ?? "thatguypdeep@gmail.com").trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let authUser = null;
for (let page = 1; page <= 20; page++) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) {
    console.error("listUsers failed:", error.message);
    process.exit(1);
  }
  authUser = data.users.find((u) => u.email?.toLowerCase() === email) ?? null;
  if (authUser || data.users.length < 1000) break;
}

if (!authUser) {
  console.error(`No auth user found for ${email}. Sign in once with OTP first, then rerun.`);
  process.exit(1);
}

const payload = {
  id: authUser.id,
  email,
  role: "super_admin",
};

const { data: profile, error: upsertErr } = await admin
  .from("profiles")
  .upsert(payload, { onConflict: "id" })
  .select("id, email, role")
  .single();

if (upsertErr) {
  console.error("Profile upsert failed:", upsertErr.message);
  process.exit(1);
}

console.log("Promoted to super_admin:", profile);
