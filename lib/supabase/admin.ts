/**
 * SERVICE ROLE CLIENT — SERVER ONLY.
 * This client bypasses RLS. Never import in client components.
 * Used exclusively for cross-user admin operations (exports, bulk ops).
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/supabase/admin.ts must only be used in server-side code."
  );
}

// Build-time placeholders let `next build` succeed on CI before dashboard env vars are set.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.placeholder";

export const adminClient = createClient<Database>(
  supabaseUrl,
  serviceRoleKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
