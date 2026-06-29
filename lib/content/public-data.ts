import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { FULL_DISCLOSURE_SECTIONS } from "@/lib/content/disclosure-full";
import { SHORTLIST_COUNT, SHORTLIST_META } from "@/lib/content/admissions-shortlist-first";
import { FALLBACK_FACULTY } from "@/lib/content/faculty-fallback";
import type { ExamDocument } from "@/lib/content/examination-portal";
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
  attachmentUrl?: string | null;
  attachmentLabel?: string | null;
  attachmentSize?: string | null;
  language?: string | null;
};

const DEFAULT_IMG = "/images/school-1.jpg";

/** Pinned notice — always shown on noticeboard and prepended to public news feeds. */
export function getShortlistNoticeItem(): PublicNewsItem {
  return {
    title: SHORTLIST_META.title,
    slug: SHORTLIST_META.noticeSlug,
    category: "Announcement",
    date: "28 Jun 2026",
    excerpt: `${SHORTLIST_COUNT} candidates shortlisted for UG admission session ${SHORTLIST_META.session} at Ramakrishna Mission Vivekananda College, Narayanpur. Download the official PDF or view the searchable list online.`,
    body: `The first list of shortlisted students for undergraduate admission (session ${SHORTLIST_META.session}) at Ramakrishna Mission Vivekananda College, Narayanpur has been published on ${SHORTLIST_META.publishedAt}.\n\n${SHORTLIST_COUNT} candidates are shortlisted across BA, B.Sc Science, B.Sc Life Science, and B.Com programmes.\n\nShortlisted candidates should follow further instructions from the admissions office and the Bastar University portal (smkvbastar.ac.in).\n\nView the full list online at ${SHORTLIST_META.href} or download the official scanned notice (PDF).`,
    img: DEFAULT_IMG,
    fromDb: false,
    attachmentUrl: SHORTLIST_META.pdfUrl,
    attachmentLabel: "Download PDF",
    attachmentSize: SHORTLIST_META.pdfSize,
    language: "EN",
  };
}

function mergePinnedNotices(items: PublicNewsItem[]): PublicNewsItem[] {
  const pinned = getShortlistNoticeItem();
  const rest = items.filter((n) => n.slug !== pinned.slug);
  return [pinned, ...rest];
}

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
      const fromDb = (data as NewsEvent[]).map((n) => ({
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
        attachmentUrl:   n.attachment_url ?? null,
        attachmentLabel: n.attachment_label ?? (n.attachment_url ? "Download PDF" : null),
        language:        n.language ?? null,
      }));
      return mergePinnedNotices(fromDb).slice(0, limit ?? 50);
    }
  } catch {
    /* fallback */
  }

  const fallback = NEWS_EVENTS.map((n) => {
    const extra = n as typeof n & {
      attachmentUrl?: string;
      attachmentLabel?: string;
      attachmentSize?: string;
      language?: string;
    };
    return {
      title:    n.title,
      slug:     n.slug,
      category: n.category,
      date:     n.date,
      excerpt:  n.excerpt,
      body:     n.excerpt,
      img:      n.img,
      fromDb:   false,
      attachmentUrl:   extra.attachmentUrl ?? null,
      attachmentLabel: extra.attachmentLabel ?? null,
      attachmentSize:  extra.attachmentSize ?? null,
      language:        extra.language ?? null,
    };
  });

  return mergePinnedNotices(fallback).slice(0, limit ?? 50);
}

export async function getNewsBySlug(slug: string): Promise<PublicNewsItem | null> {
  const all = await getPublicNews();
  return all.find((n) => n.slug === slug) ?? null;
}

export type PublicIqacDocument = {
  id: string;
  title: string;
  category: string;
  academic_year: string | null;
  file_url: string | null;
  link_url: string | null;
};

/** Published examination notices from CMS (admin → Examination). */
export async function getPublicExamNotices(limit = 50): Promise<PublicNewsItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("news_events")
      .select("*")
      .eq("is_published", true)
      .or("category.eq.examination,category.eq.Examination")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (!error && data?.length) {
      return (data as NewsEvent[]).map((n) => ({
        title:    n.title,
        slug:     n.slug,
        category: n.category ?? "examination",
        date:     n.published_at
          ? new Date(n.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
          : "",
        excerpt:  n.body?.slice(0, 180) ?? "",
        body:     n.body,
        img:      n.cover_url ?? DEFAULT_IMG,
        fromDb:   true,
        attachmentUrl:   n.attachment_url ?? null,
        attachmentLabel: n.attachment_label ?? (n.attachment_url ? "Download PDF" : null),
        language:        n.language ?? null,
      }));
    }
  } catch {
    /* fallback */
  }
  return [];
}

export async function getPublicIqacDocuments(): Promise<PublicIqacDocument[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from("iqac_documents")
      .select("id, title, category, academic_year, file_url, link_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data?.length) return data as PublicIqacDocument[];
  } catch {
    /* fallback */
  }
  return [];
}

export function publicNewsToExamDocument(n: PublicNewsItem): ExamDocument {
  const href = n.attachmentUrl
    ? n.attachmentUrl
    : n.fromDb
      ? `/news/${n.slug}`
      : "#";
  return {
    title: n.title,
    date:  n.date || undefined,
    href,
    external: Boolean(n.attachmentUrl?.startsWith("http")),
    language: n.language === "Hindi" ? "HI" : n.language === "English" ? "EN" : undefined,
    note: n.excerpt || undefined,
  };
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

const FALLBACK_FACULTY_IMPORTED = FALLBACK_FACULTY;

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
  return FALLBACK_FACULTY_IMPORTED;
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
