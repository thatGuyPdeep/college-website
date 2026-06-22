import { KNOWLEDGE_BASE } from "@/lib/ai/knowledge-base";

function scoreChunk(text: string, query: string): number {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  return words.reduce((s, w) => s + (lower.includes(w) ? 1 : 0), 0);
}

export function retrieveContextKeyword(
  query: string,
  limit = 4
): { text: string; source: string }[] {
  const scored = KNOWLEDGE_BASE
    .map((chunk) => ({ ...chunk, score: scoreChunk(chunk.text + chunk.title, query) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length === 0) {
    return KNOWLEDGE_BASE.slice(0, 3).map((c) => ({ text: c.text, source: c.source }));
  }
  return scored.map((c) => ({ text: c.text, source: c.source }));
}
