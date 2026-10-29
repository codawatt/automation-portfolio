export function createLeadRepository(pool) {
  return {
    async insertIfAbsent({ requestId, correlationId, message, category }) {
      const { rows } = await pool.query(
        `INSERT INTO leads (request_id, correlation_id, message, category)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (request_id) DO NOTHING
         RETURNING id, category, status`,
        [requestId, correlationId, message, category],
      );
      return rows[0] ?? null;
    },

    async findByRequestId(requestId) {
      const { rows } = await pool.query(
        'SELECT id, category, status FROM leads WHERE request_id = $1',
        [requestId],
      );
      return rows[0] ?? null;
    },

    async list(limit) {
      const { rows } = await pool.query(
        `SELECT id, request_id, message, category, status, notify_status, created_at
         FROM leads ORDER BY id DESC LIMIT $1`,
        [limit],
      );
      return rows;
    },
  };
}
