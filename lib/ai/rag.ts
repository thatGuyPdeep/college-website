import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { embedText } from "@/lib/ai/embeddings";
import { retrieveContextKeyword } from "@/lib/ai/keyword-retrieval";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type RetrievedChunk = { text: string; source: string; similarity?: number };

export async function retrieveFromVector(
  query: string,
  limit = 5
): Promise<RetrievedChunk[]> {
  const embedding = await embedText(query);
  if (!embedding) return [];

  try {
    const { data, error } = await admin.rpc("match_content_chunks", {
      query_embedding: embedding,
      match_count:     limit,
    });

    if (error || !data?.length) return [];

    return (data as { chunk_text: string; source_url: string | null; similarity: number }[]).map((row) => ({
      text:       row.chunk_text,
      source:     row.source_url ?? "/",
      similarity: row.similarity,
    }));
  } catch {
    return [];
  }
}

/** Vector search when chunks exist; otherwise keyword fallback. */
export async function retrieveContextHybrid(
  query: string,
  limit = 4
): Promise<RetrievedChunk[]> {
  const vector = await retrieveFromVector(query, limit);
  if (vector.length > 0) return vector;
  return retrieveContextKeyword(query, limit);
}
