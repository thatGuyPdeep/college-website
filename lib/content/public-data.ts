import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { FULL_DISCLOSURE_SECTIONS } from "@/lib/content/disclosure-full";
import { NEWS_EVENTS, CONTACT } from "@/lib/utils/constants";
import type { FacultyMember, NewsEvent, DisclosureItem, Program } from "@/lib/supabase/types";

const db = _adminClient as ReturnType<typeof import("@supabase/supabase-js").createClient>;

export type PublicNewsItem = {
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  body?: string | null;
  img: string;
  fromDb: boolean;
};

const DEFAULT_IMG = "/images/school-1.jpg";

export async function getPublicNews(limit?: number): Promise<PublicNewsItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("news_events")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit ?? 50);

    if (!error && data?.length) {
      return (data as NewsEvent[]).map((n) => ({
        title:    n.title,
        slug:     n.slug,
        category: n.category ?? "Notice",
        date:     n.published_at
          ? new Date(n.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
          : "",
        excerpt:  n.body?.slice(0, 180) ?? "",
        body:     n.body,
        img:      n.cover_url ?? DEFAULT_IMG,
        fromDb:   true,
      }));
    }
  } catch {
    /* fallback */
  }

  return NEWS_EVENTS.map((n) => ({
    title:    n.title,
    slug:     n.title.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
    category: n.category,
    date:     n.date,
    excerpt:  n.excerpt,
    body:     n.excerpt,
    img:      n.img,
    fromDb:   false,
  })).slice(0, limit ?? 50);
}

export async function getNewsBySlug(slug: string): Promise<PublicNewsItem | null> {
  const all = await getPublicNews();
  return all.find((n) => n.slug === slug) ?? null;
}

export type PublicFacultyItem = {
  id: string;
  name: string;
  designation: string;
  dept: string;
  qual: string;
  exp: number;
  specialization: string;
  photo_url: string | null;
};

function facultySlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const FALLBACK_FACULTY: PublicFacultyItem[] = [];

export async function getPublicFaculty(): Promise<PublicFacultyItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("faculty")
      .select("*, departments(name)")
      .eq("is_active", true)
      .order("full_name");

    if (!error && data?.length) {
      return (data as (FacultyMember & { departments?: { name: string } })[]).map((f) => ({
        id:             f.id,
        name:           f.full_name,
        designation:    f.designation ?? "Faculty",
        dept:           f.departments?.name ?? "—",
        qual:           f.qualifications ?? "—",
        exp:            f.experience_years ?? 0,
        specialization: f.specialization ?? "—",
        photo_url:      f.photo_url,
      }));
    }
  } catch {
    /* fallback */
  }
  return FALLBACK_FACULTY;
}

export async function getFacultyById(id: string): Promise<PublicFacultyItem | null> {
  const all = await getPublicFaculty();
  return all.find((f) => f.id === id || facultySlug(f.name) === id) ?? null;
}

export async function getPublicPrograms(): Promise<Program[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("programs")
      .select("*, departments(name)")
      .eq("is_active", true)
      .order("name");

    if (!error && data?.length) return data as Program[];
  } catch {
    /* fallback */
  }
  return [];
}

export type DisclosureSection = { id: string; label: string; items: { label: string; href: string }[] };

const STATIC_DISCLOSURE: DisclosureSection[] = [
  {
    id: "about", label: "A) About HEI",
    items: [
      { label: "About Us / Overview", href: "/about" },
      { label: "Affiliating University", href: "/about" },
      { label: "Mandatory Disclosure (this page)", href: "/disclosure" },
    ],
  },
  {
    id: "academics", label: "C) Academics",
    items: [
      { label: "List of Academic Programmes", href: "/academics" },
      { label: "Departments", href: "/academics/departments" },
      { label: "Faculty Details", href: "/faculty" },
      { label: "Library", href: "/campus/library" },
    ],
  },
  {
    id: "admissions_fee", label: "D) Admissions & Fee",
    items: [
      { label: "Admission Process", href: "/admissions/apply" },
      { label: "Track Application", href: "/admissions/dashboard" },
      { label: "Contact for Fee Structure", href: "/contact" },
    ],
  },
];

export async function getPublicDisclosure(): Promise<DisclosureSection[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("disclosure_items")
      .select("*")
      .order("sort_order");

    if (!error && data?.length) {
      const grouped = new Map<string, DisclosureSection>();
      for (const item of data as DisclosureItem[]) {
        const key = item.section;
        if (!grouped.has(key)) {
          grouped.set(key, { id: key, label: key, items: [] });
        }
        grouped.get(key)!.items.push({
          label: item.label,
          href:  item.link_url ?? item.file_path ?? "#",
        });
      }
      return [...grouped.values()];
    }
  } catch {
    /* fallback */
  }
  return STATIC_DISCLOSURE;
}

/** Merge full static UGC sections with DB items appended to matching sections. */
export async function getMergedDisclosure(): Promise<DisclosureSection[]> {
  const merged = FULL_DISCLOSURE_SECTIONS.map((s) => ({ ...s, items: [...s.items] }));

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("disclosure_items")
      .select("*")
      .order("sort_order");

    if (!error && data?.length) {
      for (const item of data as DisclosureItem[]) {
        const section = merged.find(
          (s) => s.id === item.section || s.label === item.section
        );
        const entry = {
          label: item.label,
          href:  item.link_url ?? item.file_path ?? "#",
        };
        if (section) {
          if (!section.items.some((i) => i.label === entry.label)) {
            section.items.push(entry);
          }
        } else {
          merged.push({ id: item.section, label: item.section, items: [entry] });
        }
      }
    }
  } catch {
    /* static only */
  }

  return merged;
}

export { CONTACT };
