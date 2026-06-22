-- pgvector similarity search RPC for AI RAG

CREATE OR REPLACE FUNCTION match_content_chunks(
  query_embedding vector(1536),
  match_count     INT DEFAULT 5
)
RETURNS TABLE (
  id          UUID,
  source_url  TEXT,
  chunk_text  TEXT,
  similarity  FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    source_url,
    text AS chunk_text,
    1 - (embedding <=> query_embedding) AS similarity
  FROM content_chunks
  WHERE embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
