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

export const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
