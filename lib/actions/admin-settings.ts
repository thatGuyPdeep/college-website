"use server";

import { requireRole } from "@/lib/auth/helpers";
import { APPLICATION_FEE_INR, isPaymentRequired } from "@/lib/payments/razorpay";
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

  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV ?? "development",
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    resendFrom: RESEND_FROM,
    paymentsEnabled: isPaymentRequired(),
    applicationFeeInr: APPLICATION_FEE_INR,
    razorpayKeyConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    webhookSecretConfigured: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
    sentryConfigured: Boolean(process.env.SENTRY_DSN),
    resendDomainVerified: Boolean(process.env.RESEND_API_KEY) && !usesResendTestSender(),
  };
}
