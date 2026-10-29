CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  correlation_id TEXT NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  category TEXT NOT NULL CHECK (category IN ('RCA', 'CASCO', 'GENERAL')),
  status TEXT NOT NULL DEFAULT 'NEW',
  notify_status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (notify_status IN ('PENDING', 'SENT', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
