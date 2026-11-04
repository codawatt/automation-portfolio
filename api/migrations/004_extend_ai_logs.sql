ALTER TABLE ai_query_logs
  ADD COLUMN reason TEXT,
  ADD COLUMN quarantined_ids JSONB NOT NULL DEFAULT '[]';
