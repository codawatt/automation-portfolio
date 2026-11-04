import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createKnowledgeService } from '../src/services/knowledgeService.js';

const pool = { query: async () => ({}) };

test('search returns at most the mapped results from the repository', async () => {
  const faqRepository = {
    search: async (question, limit) => {
      assert.equal(limit, 3);
      return [{ id: 'FAQ-03', title: 'Tichet', excerpt: 'Text', score: 0.123456 }];
    },
  };
  const knowledgeService = createKnowledgeService({ faqRepository });
  const app = createApp({ pool, knowledgeService });

  const res = await request(app).post('/api/knowledge/search').send({ question: 'Cum deschid un tichet?' });

  assert.equal(res.status, 200);
  assert.deepEqual(res.body.results, [{ id: 'FAQ-03', title: 'Tichet', excerpt: 'Text', score: 0.1235 }]);
});

test('search rejects an empty question', async () => {
  const app = createApp({ pool, knowledgeService: { search: async () => [] } });
  const res = await request(app).post('/api/knowledge/search').send({ question: '' });
  assert.equal(res.status, 400);
});

test('answer returns 503 and a correlationId when the AI times out', async () => {
  const answerService = {
    answer: async () => ({ status: 'AI_ERROR', reason: 'timeout', grounded: false, answer: null, sources: [] }),
  };
  const app = createApp({ pool, answerService });
  const res = await request(app).post('/api/knowledge/answer').send({ question: 'Cum deschid un tichet?' });
  assert.equal(res.status, 503);
  assert.match(res.body.correlationId, /^api-/);
});
