import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils/constants";
import { getExplorerPrograms } from "@/lib/content/programs";
import { DEPARTMENTS } from "@/lib/content/departments";
import { getPublicNews, getPublicFaculty } from "@/lib/content/public-data";
import { INSPIRATION_BIOGRAPHIES } from "@/lib/content/inspiration";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const staticPages = [
    "", "/about", "/about/history", "/about/awards", "/about/activities", "/donate", "/vision-mission", "/academics", "/academics/iti", "/academics/departments",
    "/faculty", "/campus/infrastructure", "/campus/library", "/campus/hostel", "/gallery",
    "/news", "/placements", "/contact", "/disclosure", "/careers", "/search", "/privacy",
    "/terms", "/refund",
    "/admissions", "/admissions/how-to-apply", "/admissions/fees", "/admissions/scholarships",
    "/admissions/apply", "/login",
  ];

  const [programs, news, faculty] = await Promise.all([
    getExplorerPrograms(),
    getPublicNews(),
    getPublicFaculty(),
  ]);

  const entries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url:             `${base}${path}`,
    lastModified:    now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:        path === "" ? 1 : path.startsWith("/admissions") ? 0.9 : 0.7,
  }));

  for (const p of programs) {
    entries.push({
      url:             `${base}/academics/courses/${p.slug}`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.8,
    });
  }

  for (const d of DEPARTMENTS) {
    entries.push({
      url:             `${base}/academics/departments/${d.slug}`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    });
  }

  for (const n of news) {
    if (n.fromDb || n.slug) {
      entries.push({
        url:             `${base}/news/${n.slug}`,
        lastModified:    now,
        changeFrequency: "weekly",
        priority:        0.6,
      });
    }
  }

  for (const f of faculty) {
    entries.push({
      url:             `${base}/faculty/${f.id}`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.5,
    });
  }

  for (const p of INSPIRATION_BIOGRAPHIES) {
    entries.push({
      url:             `${base}/about/inspiration/${p.slug}`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.5,
    });
  }

  return entries;
}
