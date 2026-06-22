import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils/constants";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/student", "/admissions/dashboard", "/careers/dashboard"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
