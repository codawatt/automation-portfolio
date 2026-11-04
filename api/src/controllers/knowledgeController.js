
import { randomUUID } from 'node:crypto';
import { validateQuestion } from '../validators/questionValidator.js';
const CORRELATION_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;
export function createKnowledgeController({ knowledgeService, answerService }) {
  return {
    async search(req, res) {
      const result = validateQuestion(req.body);
      if (!result.valid) {
        return res.status(400).json({ error: 'validation_error', details: result.errors });
      }
      const results = await knowledgeService.search(result.value);
      res.json({ results });
    },
    async answer(req, res) {
          const result = validateQuestion(req.body);
          if (!result.valid) {
            return res.status(400).json({ error: 'validation_error', details: result.errors });
          }
          const supplied = req.body.correlationId;
          const correlationId = typeof supplied === 'string' && CORRELATION_PATTERN.test(supplied)
            ? supplied
            : `api-${randomUUID()}`;

          const answer = await answerService.answer({ question: result.value, correlationId });

          let statusCode = 200;
          if (answer.status === 'AI_ERROR') {
            statusCode = ['timeout', 'unreachable'].includes(answer.reason) ? 503 : 502;
          }
          res.status(statusCode).json({ correlationId, ...answer });
    },
  };
}



