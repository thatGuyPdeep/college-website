import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { getPublicNews } from "@/lib/content/public-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Events",
  description: "Campus events, festivals, and programmes at Ramakrishna Mission Vivekananda College.",
};

export default async function EventsPage() {
  const all = await getPublicNews(50);
  const events = all.filter((n) => n.category === "Event");

  return (
    <MarketingPage
      title="Events"
      hindiTitle="कार्यक्रम"
      description="Festivals, observances, sports meets, and campus programmes."
      breadcrumbs={[{ label: "Media", href: "/news" }]}
    >
      {events.length === 0 ? (
        <p className="text-gray-500">No events listed at this time. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <Link key={e.slug} href={`/news/${e.slug}`} className="group block h-full">
              <Card className="h-full overflow-hidden card-lift border-blue-100 pt-0 gap-0">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={e.img}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs border-[#C8201A] text-[#C8201A]">
                    Event
                  </Badge>
                  <h2 className="font-semibold text-[#0D2660] group-hover:text-[#C8201A] transition-colors">
                    {e.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">{e.date}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </MarketingPage>
  );
}
