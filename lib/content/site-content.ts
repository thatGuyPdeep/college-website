import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { LEADERSHIP } from "@/lib/utils/constants";
import {
  PUBLICATIONS_ENGLISH,
  PUBLICATIONS_INDIAN_LANGUAGES,
  ESSENTIAL_BOOKS_HIGHLIGHTS,
  PUBLICATIONS_HUB,
} from "@/lib/content/publications";

export type PublicLeadershipEntry = {
  name: string;
  title: string;
  body: string;
  image_url?: string | null;
  fromDb: boolean;
};

export type PublicPublicationLink = {
  label: string;
  href: string;
  fromDb: boolean;
};

export async function getPublicLeadership(): Promise<PublicLeadershipEntry[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (_adminClient as any)
      .from("leadership_entries")
      .select("name, title, body, image_url")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (!error && data?.length) {
      return (data as { name: string; title: string; body: string; image_url: string | null }[]).map((r) => ({
        ...r,
        fromDb: true,
      }));
    }
  } catch {
    /* fallback */
  }
  return LEADERSHIP.map((p) => ({ ...p, fromDb: false }));
}

export async function getPublicPublications(): Promise<{
  hub: typeof PUBLICATIONS_HUB;
  english: PublicPublicationLink[];
  indianLanguages: PublicPublicationLink[];
  highlights: PublicPublicationLink[];
}> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (_adminClient as any)
      .from("publication_links")
      .select("section, label, href")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (!error && data?.length) {
      const rows = data as { section: string; label: string; href: string }[];
      return {
        hub: PUBLICATIONS_HUB,
        english: rows.filter((r) => r.section === "english").map((r) => ({ label: r.label, href: r.href, fromDb: true })),
        indianLanguages: rows.filter((r) => r.section === "indian_language").map((r) => ({ label: r.label, href: r.href, fromDb: true })),
        highlights: rows.filter((r) => r.section === "highlight").map((r) => ({ label: r.label, href: r.href, fromDb: true })),
      };
    }
  } catch {
    /* fallback */
  }
  return {
    hub: PUBLICATIONS_HUB,
    english: PUBLICATIONS_ENGLISH.map((p) => ({ ...p, fromDb: false })),
    indianLanguages: PUBLICATIONS_INDIAN_LANGUAGES.map((p) => ({ ...p, fromDb: false })),
    highlights: ESSENTIAL_BOOKS_HIGHLIGHTS.map((label) => ({
      label,
      href: "https://publications.rkmm.org/essential-books",
      fromDb: false,
    })),
  };
}
