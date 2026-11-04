const SEARCH_SQL = `
  WITH q AS (
    SELECT replace(plainto_tsquery('romanian', unaccent($1))::text, '&', '|')::tsquery AS query
  ),
  docs AS (
    SELECT id, title, content,
           to_tsvector('romanian', unaccent(title || ' ' || content)) AS vector
    FROM faq_documents
  )
  SELECT docs.id, docs.title, docs.content AS excerpt,
         ts_rank(docs.vector, q.query) AS score
  FROM docs, q
  WHERE docs.vector @@ q.query
  ORDER BY score DESC, docs.id
  LIMIT $2`;

export function createFaqRepository(pool) {
  return {
    async search(question, limit) {
      const { rows } = await pool.query(SEARCH_SQL, [question, limit]);
      return rows;
    },
  };
}
