import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createKnowledgeService } from '../src/services/knowledgeService.js';

test('search sends only meaningful terms to the repository', async () => {
  let received;
  const faqRepository = { search: async (text) => { received = text; return []; } };
  await createKnowledgeService({ faqRepository }).search('Cum deschid un tichet?');
  assert.equal(received, 'deschid tichet');
});

test('search skips the database when only stopwords remain', async () => {
  const faqRepository = { search: async () => { throw new Error('should not be called'); } };
  const results = await createKnowledgeService({ faqRepository }).search('Care este?');
  assert.deepEqual(results, []);
});
