import express from 'express';
import { createLeadController } from './controllers/leadController.js';

export function createApp({ pool, leadService }) {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', async (req, res) => {
    const started = Date.now();
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', db: 'ok', durationMs: Date.now() - started });
    } catch (err) {
      console.error('Health check failed:', err.message);
      res.status(503).json({ status: 'degraded', db: 'unreachable' });
    }
  });

  const leads = createLeadController({ leadService });
  app.post('/api/leads', leads.create);
  app.get('/api/leads', leads.list);

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'invalid_json' });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'payload_too_large' });
    }
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}
