import Link from "next/link";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingPage } from "@/components/layout/MarketingPage";

type PortalPlaceholderProps = {
  title: string;
  hindiTitle?: string;
  description: string;
  parentCrumb?: { label: string; href: string };
  contactNote?: string;
};

export function PortalPlaceholder({
  title,
  hindiTitle,
  description,
  parentCrumb,
  contactNote = "For immediate assistance, contact rkm.narainpur@gmail.com or call 07781-252251.",
}: PortalPlaceholderProps) {
  return (
    <MarketingPage
      title={title}
      hindiTitle={hindiTitle}
      description={description}
      breadcrumbs={parentCrumb ? [parentCrumb] : []}
    >
      <div className="max-w-2xl mx-auto text-center py-12 px-6 rounded-2xl border border-blue-100 bg-[#F0F4FF]">
        <Construction className="h-12 w-12 text-[#0D2660] mx-auto mb-4 opacity-60" aria-hidden="true" />
        <h2 className="text-lg font-bold text-[#0D2660] mb-2">Module Under Integration</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{contactNote}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
            <Link href="/news">View Notices</Link>
          </Button>
          <Button asChild className="bg-[#0D2660] hover:bg-[#071540]">
            <Link href="/contact">Contact Office</Link>
          </Button>
        </div>
      </div>
    </MarketingPage>
  );
}
