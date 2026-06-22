import { NextResponse } from "next/server";
import { getPublicNews } from "@/lib/content/public-data";
import { SITE_URL, SITE_FULL_NAME } from "@/lib/utils/constants";

export async function GET() {
  const items = await getPublicNews(20);
  const base = SITE_URL.replace(/\/$/, "");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_FULL_NAME} — News &amp; Events</title>
    <link>${base}/news</link>
    <description>Latest news and notices from Ramakrishna Mission College, Narayanpur</description>
    ${items.map((n) => `
    <item>
      <title><![CDATA[${n.title}]]></title>
      <link>${base}/news/${n.slug}</link>
      <description><![CDATA[${n.excerpt}]]></description>
      <pubDate>${n.date}</pubDate>
      <category>${n.category}</category>
    </item>`).join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
