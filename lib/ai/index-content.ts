import { embedText } from "@/lib/ai/embeddings";
import { adminClient as _adminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export async function upsertContentChunk(sourceUrl: string, text: string): Promise<void> {
  if (!process.env.OPENAI_API_KEY || !text.trim()) return;

  const embedding = await embedText(text);
  if (!embedding) return;

  await admin.from("content_chunks").delete().eq("source_url", sourceUrl);
  await admin.from("content_chunks").insert({
    source_url: sourceUrl,
    text:       text.slice(0, 8000),
    embedding,
  });
}

export async function deleteContentChunk(sourceUrl: string): Promise<void> {
  await admin.from("content_chunks").delete().eq("source_url", sourceUrl);
}

export async function indexNewsForRag(item: {
  slug: string;
  title: string;
  body?: string | null;
  category?: string | null;
}): Promise<void> {
  const text = [item.title, item.category, item.body].filter(Boolean).join(". ");
  await upsertContentChunk(`/news/${item.slug}`, text);
}

export async function indexProgramForRag(item: {
  slug: string;
  name: string;
  level?: string;
  mode?: string;
  duration?: string | null;
  eligibility?: string | null;
  fees?: number | null;
}): Promise<void> {
  const text = [
    item.name,
    item.level,
    item.mode,
    item.duration,
    item.eligibility,
    item.fees != null ? `Fees INR ${item.fees}` : null,
    `Programme page /academics/courses/${item.slug}`,
  ].filter(Boolean).join(". ");
  await upsertContentChunk(`/academics/courses/${item.slug}`, text);
}

export async function indexFacultyForRag(item: {
  id: string;
  full_name: string;
  designation?: string | null;
  qualifications?: string | null;
  specialization?: string | null;
  profile?: string | null;
}): Promise<void> {
  const text = [
    item.full_name,
    item.designation,
    item.qualifications,
    item.specialization,
    item.profile,
    `Faculty profile /faculty/${item.id}`,
  ].filter(Boolean).join(". ");
  await upsertContentChunk(`/faculty/${item.id}`, text);
}

export async function indexDisclosureForRag(item: {
  section: string;
  label: string;
  link_url?: string | null;
}): Promise<void> {
  const text = `Disclosure: ${item.label} in section ${item.section}. Link: ${item.link_url ?? "/disclosure"}`;
  await upsertContentChunk(`/disclosure#${item.section}-${item.label}`, text);
}

export async function indexStaticPageForRag(sourceUrl: string, text: string): Promise<void> {
  await upsertContentChunk(sourceUrl, text);
}
