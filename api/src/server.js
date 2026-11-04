import { createApp } from './app.js';
import { config } from './config/index.js';
import { pool } from './config/database.js';
import { runMigrations } from './db/migrate.js';
import { createLeadRepository } from './repositories/leadRepository.js';
import { createLeadService } from './services/leadService.js';
import { ruleClassifier } from './strategies/ruleClassifier.js';
import { createFaqRepository } from './repositories/faqRepository.js';
import { createKnowledgeService } from './services/knowledgeService.js';
import { createOllamaProvider } from './adapters/ollamaProvider.js';
import { createAiLogRepository } from './repositories/aiLogRepository.js';
import { createAnswerService } from './services/answerService.js';
await runMigrations(pool);

const leadService = createLeadService({
  leadRepository: createLeadRepository(pool),
  classifier: ruleClassifier,
});

const knowledgeService = createKnowledgeService({
  faqRepository: createFaqRepository(pool),
});

const answerService = createAnswerService({
  knowledgeService,
  aiProvider: createOllamaProvider(config.ai),
  aiLogRepository: createAiLogRepository(pool),
  pricing: config.ai.pricing,
});
const app = createApp({ pool, leadService, knowledgeService, answerService });
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
