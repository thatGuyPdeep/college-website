import { ContentPreviewLink } from "@/components/admin/ContentPreviewLink";

const PUBLIC_PAGES = [
  { href: "/news", label: "News & notices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faculty", label: "Faculty directory" },
  { href: "/academics", label: "Programmes" },
  { href: "/about#leadership", label: "Leadership" },
  { href: "/campus/library/e-resources", label: "Library publications" },
  { href: "/disclosure", label: "Mandatory disclosure" },
] as const;

export function ContentPreviewBar() {
  return (
    <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/40 px-5 py-4">
      <p className="text-sm font-medium text-[#0D2660] mb-2">Preview public pages</p>
      <p className="text-xs text-gray-500 mb-3">
        Open the live site in a new tab to verify content before publishing.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {PUBLIC_PAGES.map((page) => (
          <ContentPreviewLink key={page.href} href={page.href} label={page.label} />
        ))}
      </div>
    </div>
  );
}
