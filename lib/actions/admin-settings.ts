"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/helpers";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";
import { getOperationalSettings, isOperationalPaymentRequired, type OperationalSettings } from "@/lib/config/operational-settings";
import { RESEND_FROM, usesResendTestSender } from "@/lib/email/resend-config";

export type SystemConfig = {
  siteUrl: string;
  nodeEnv: string;
  supabaseConfigured: boolean;
  resendConfigured: boolean;
  resendFrom: string;
  paymentsEnabled: boolean;
  applicationFeeInr: number;
  razorpayKeyConfigured: boolean;
  webhookSecretConfigured: boolean;
  openaiConfigured: boolean;
  openaiModel: string;
  embeddingModel: string;
  sentryConfigured: boolean;
  resendDomainVerified: boolean;
};

export async function getSystemConfig(): Promise<SystemConfig> {
  await requireRole(["admin", "super_admin"]);

  const operational = await getOperationalSettings();
  const paymentsEnabled = await isOperationalPaymentRequired();

  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV ?? "development",
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    resendFrom: RESEND_FROM,
    paymentsEnabled,
    applicationFeeInr: operational.application_fee_inr,
    razorpayKeyConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    webhookSecretConfigured: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
    sentryConfigured: Boolean(process.env.SENTRY_DSN),
    resendDomainVerified: Boolean(process.env.RESEND_API_KEY) && !usesResendTestSender(),
  };
}

const OPERATIONAL_SETTINGS_KEY = "operational_settings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export async function saveOperationalSettings(
  settings: OperationalSettings,
): Promise<ActionResult<void>> {
  try {
    const profile = await requireRole(["super_admin"]);
    const fee = Math.max(0, Math.round(settings.application_fee_inr));

    const { error } = await admin.from("site_settings").upsert({
      key:        OPERATIONAL_SETTINGS_KEY,
      value:      {
        application_fee_inr: fee,
        payments_enabled:    settings.payments_enabled,
      },
      updated_at: new Date().toISOString(),
      updated_by: (profile as { id: string }).id,
    });
    if (error) throw error;

    revalidatePath("/admin/settings");
    revalidatePath("/admissions");
    revalidatePath("/admissions/fees");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
