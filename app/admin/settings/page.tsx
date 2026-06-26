import { requirePermission, getUserProfile } from "@/lib/auth/helpers";
import { getSystemConfig } from "@/lib/actions/admin-settings";
import { getOperationalSettings } from "@/lib/config/operational-settings";
import { OperationalSettingsForm } from "@/components/admin/OperationalSettingsForm";
import { canEditSettings } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

function StatusBadge({ ok, label }: { ok: boolean; label?: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${ok ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
      {label ?? (ok ? "Configured" : "Not set")}
    </span>
  );
}

export default async function AdminSettingsPage() {
  await requirePermission("settings", "view");
  const profile = await getUserProfile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  const canEdit = canEditSettings(role);
  const [cfg, operational] = await Promise.all([getSystemConfig(), getOperationalSettings()]);

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Environment", value: cfg.nodeEnv },
    { label: "Site URL", value: <code className="text-xs">{cfg.siteUrl}</code> },
    {
      label: "Supabase",
      value: <StatusBadge ok={cfg.supabaseConfigured} />,
    },
    {
      label: "Email (Resend)",
      value: (
        <span className="flex flex-wrap items-center gap-2">
          <StatusBadge ok={cfg.resendConfigured} />
          <StatusBadge ok={cfg.resendDomainVerified} label={cfg.resendDomainVerified ? "Domain verified" : "Test sender"} />
          <span className="text-xs text-gray-500">{cfg.resendFrom}</span>
        </span>
      ),
    },
    {
      label: "Admission payments",
      value: (
        <span className="flex flex-wrap items-center gap-2">
          <StatusBadge ok={cfg.paymentsEnabled} label={cfg.paymentsEnabled ? "Enabled" : "Disabled"} />
          <span className="text-xs text-gray-500">Fee: ₹{cfg.applicationFeeInr}</span>
        </span>
      ),
    },
    {
      label: "Razorpay keys",
      value: <StatusBadge ok={cfg.razorpayKeyConfigured} />,
    },
    {
      label: "Razorpay webhook secret",
      value: <StatusBadge ok={cfg.webhookSecretConfigured} />,
    },
    {
      label: "AI assistant (OpenAI)",
      value: (
        <span className="flex flex-wrap items-center gap-2">
          <StatusBadge ok={cfg.openaiConfigured} />
          {cfg.openaiConfigured && (
            <span className="text-xs text-gray-500">{cfg.openaiModel} · {cfg.embeddingModel}</span>
          )}
        </span>
      ),
    },
    {
      label: "Error monitoring (Sentry)",
      value: <StatusBadge ok={cfg.sentryConfigured} label={cfg.sentryConfigured ? "Active" : "Not set"} />,
    },
    {
      label: "Health check",
      value: <code className="text-xs">/api/health</code>,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">System Settings</h1>
      <p className="text-sm text-gray-500 mb-8">
        {canEdit
          ? "Super admin can tune admission fees below or update API keys in Netlify / .env.local."
          : "Read-only overview. Only super admin can change system configuration."}
      </p>

      <dl className="bg-white border border-blue-100 rounded-xl divide-y divide-blue-50">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap justify-between gap-2 px-5 py-4">
            <dt className="text-sm font-medium text-gray-700">{row.label}</dt>
            <dd className="text-sm text-gray-600">{row.value}</dd>
          </div>
        ))}
      </dl>

      {canEdit && <OperationalSettingsForm initial={operational} />}

      <p className="text-xs text-gray-400 mt-6">
        After changing env vars, redeploy or restart the dev server. Run pending SQL migrations in Supabase (001–026) if tables or columns are missing.
      </p>
    </div>
  );
}
