const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
const EMBEDDING_DIM   = 1536;

export async function embedText(text: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text.slice(0, 8000),
      }),
    });

    if (!res.ok) return null;
    const data = await res.json() as { data?: { embedding?: number[] }[] };
    const embedding = data.data?.[0]?.embedding;
    if (!embedding || embedding.length !== EMBEDDING_DIM) return null;
    return embedding;
  } catch {
    return null;
  }
}

export { EMBEDDING_DIM };
