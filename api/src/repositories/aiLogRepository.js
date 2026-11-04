export function createAiLogRepository(pool) {
  return {
    async insert(log) {
      await pool.query(
        `INSERT INTO ai_query_logs
           (correlation_id, grounded, source_ids, model, tokens_in, tokens_out,
            estimated_cost_usd, duration_ms, status, reason, quarantined_ids)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          log.correlationId, log.grounded, JSON.stringify(log.sources), log.model,
          log.tokensIn, log.tokensOut, log.estimatedCostUsd, log.durationMs,
          log.status, log.reason ?? null, JSON.stringify(log.quarantined),
        ],
      );
    },
  };
}
