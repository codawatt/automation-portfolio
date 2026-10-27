import express from 'express';

export function createApp({ pool }) {
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

  return app;
}
