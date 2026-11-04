CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE faq_documents (
  id TEXT PRIMARY KEY CHECK (id ~ '^FAQ-[0-9]{2}$'),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_query_logs (
  id BIGSERIAL PRIMARY KEY,
  correlation_id TEXT NOT NULL,
  grounded BOOLEAN NOT NULL,
  source_ids JSONB NOT NULL DEFAULT '[]',
  model TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  estimated_cost_usd NUMERIC(12,8),
  duration_ms INTEGER,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
