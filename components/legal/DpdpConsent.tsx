import Link from "next/link";
import { DPDP_CONSENT_TEXT } from "@/lib/legal/dpdp";

interface Props {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export function DpdpConsent({ id = "dpdp-consent", checked, onChange, required = true }: Props) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-1 h-4 w-4 shrink-0 accent-[#0D2660]"
      />
      <span>
        {DPDP_CONSENT_TEXT}{" "}
        <Link href="/privacy" className="text-[#0D2660] underline" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
