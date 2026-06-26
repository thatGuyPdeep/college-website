import { adminClient as _adminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const OPERATIONAL_SETTINGS_KEY = "operational_settings";

export type OperationalSettings = {
  application_fee_inr: number;
  payments_enabled: boolean;
};

const ENV_DEFAULTS: OperationalSettings = {
  application_fee_inr: Number(process.env.APPLICATION_FEE_INR ?? "0"),
  payments_enabled: Number(process.env.APPLICATION_FEE_INR ?? "0") > 0,
};

export async function getOperationalSettings(): Promise<OperationalSettings> {
  try {
    const { data } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", OPERATIONAL_SETTINGS_KEY)
      .maybeSingle();

    const stored = (data?.value ?? {}) as Partial<OperationalSettings>;
    return {
      application_fee_inr:
        typeof stored.application_fee_inr === "number"
          ? stored.application_fee_inr
          : ENV_DEFAULTS.application_fee_inr,
      payments_enabled:
        typeof stored.payments_enabled === "boolean"
          ? stored.payments_enabled
          : ENV_DEFAULTS.payments_enabled,
    };
  } catch {
    return ENV_DEFAULTS;
  }
}

export async function getApplicationFeeInr(): Promise<number> {
  const settings = await getOperationalSettings();
  return settings.application_fee_inr;
}

export async function isOperationalPaymentRequired(): Promise<boolean> {
  const settings = await getOperationalSettings();
  const keysOk = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  return settings.payments_enabled && settings.application_fee_inr > 0 && keysOk;
}
