import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createOllamaProvider } from '../src/adapters/ollamaProvider.js';

const prompt = { system: 's', user: 'u' };

test('maps the Ollama response to the internal contract', async () => {
  const fetchFn = async () => ({
    ok: true,
    json: async () => ({
      message: { content: JSON.stringify({ answer: ' Text ', sourceIds: ['FAQ-03'] }) },
      prompt_eval_count: 120,
      eval_count: 30,
    }),
  });
  const provider = createOllamaProvider({ baseUrl: 'http://x', model: 'm', timeoutMs: 1000, fetchFn });
  assert.deepEqual(await provider.answer(prompt), {
    text: 'Text', sourceIds: ['FAQ-03'], usage: { in: 120, out: 30 },
  });
});

test('a timeout becomes AiProviderError with code timeout', async () => {
  const fetchFn = async () => {
    const err = new Error('aborted');
    err.name = 'TimeoutError';
    throw err;
  };
  const provider = createOllamaProvider({ baseUrl: 'http://x', model: 'm', timeoutMs: 1, fetchFn });
  await assert.rejects(provider.answer(prompt), { name: 'AiProviderError', code: 'timeout' });
});
