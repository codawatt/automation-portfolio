import { createApp } from './app.js';
import { config } from './config/index.js';
import { pool } from './config/database.js';
import { runMigrations } from './db/migrate.js';
import { createLeadRepository } from './repositories/leadRepository.js';
import { createLeadService } from './services/leadService.js';
import { ruleClassifier } from './strategies/ruleClassifier.js';
await runMigrations(pool);

const leadService = createLeadService({
  leadRepository: createLeadRepository(pool),
  classifier: ruleClassifier,
});

const app = createApp({ pool, leadService });
const server = app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
