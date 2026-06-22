import { SITE_FULL_NAME, SITE_URL, SITE_LOCATION, RKM_FACTS } from "@/lib/utils/constants";

export function organizationJsonLd() {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type":    "CollegeOrUniversity",
    name:       SITE_FULL_NAME,
    url:        base,
    logo:       `${base}/rkm-logo.png`,
    address: {
      "@type":           "PostalAddress",
      addressLocality:   "Narayanpur",
      addressRegion:     "Chhattisgarh",
      addressCountry:    "IN",
    },
    description: `${SITE_FULL_NAME}, ${SITE_LOCATION} — affiliated to ${RKM_FACTS.university}.`,
    telephone:   "+91-7781-252251",
    email:       "rkm.narainpur@gmail.com",
  };
}

export function courseJsonLd(p: { name: string; description: string; url: string }) {
  return {
    "@context":    "https://schema.org",
    "@type":         "Course",
    name:            p.name,
    description:     p.description,
    url:             p.url,
    provider: {
      "@type": "CollegeOrUniversity",
      name:    SITE_FULL_NAME,
      url:     SITE_URL.replace(/\/$/, ""),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context":        "https://schema.org",
    "@type":           "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       item.name,
      item:       item.url,
    })),
  };
}
