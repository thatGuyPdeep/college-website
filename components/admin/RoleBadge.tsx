import type { UserRole } from "@/lib/supabase/types";
import { roleLabel } from "@/lib/content/staff-roles";
import { cn } from "@/lib/utils";

export function RoleBadge({
  role,
  className,
  showHindi = true,
}: {
  role: UserRole;
  className?: string;
  showHindi?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col items-start gap-0.5 rounded-md bg-[#F0F4FF] border border-blue-100 px-2 py-1 text-xs",
        className,
      )}
      title={showHindi ? roleLabel(role, "hi") : undefined}
    >
      <span className="font-medium text-[#0D2660]">{roleLabel(role, "en")}</span>
      {showHindi && <span className="text-[10px] text-gray-500 devanagari">{roleLabel(role, "hi")}</span>}
    </span>
  );
}
