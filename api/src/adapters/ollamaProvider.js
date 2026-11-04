import { AiProviderError } from './aiProviderError.js';

const ANSWER_SCHEMA = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    sourceIds: { type: 'array', items: { type: 'string' } },
  },
  required: ['answer', 'sourceIds'],
};

export function createOllamaProvider({ baseUrl, model, timeoutMs, fetchFn = fetch }) {
  return {
    model,

    async answer({ system, user }) {
      let response;
      try {
        response = await fetchFn(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            stream: false,
            format: ANSWER_SCHEMA,
            options: { temperature: 0 },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (err) {
        throw new AiProviderError(err.name === 'TimeoutError' ? 'timeout' : 'unreachable', err.message);
      }

      if (!response.ok) {
        throw new AiProviderError(`http_${response.status}`, `Ollama answered ${response.status}`);
      }

      const data = await response.json();
      let parsed;
      try {
        parsed = JSON.parse(data.message?.content ?? '');
      } catch {
        throw new AiProviderError('invalid_output', 'Model returned non-JSON content');
      }
      if (typeof parsed.answer !== 'string' || !Array.isArray(parsed.sourceIds)) {
        throw new AiProviderError('invalid_output', 'Model returned an unexpected shape');
      }

      return {
        text: parsed.answer.trim(),
        sourceIds: parsed.sourceIds.filter((id) => typeof id === 'string'),
        usage: { in: data.prompt_eval_count ?? 0, out: data.eval_count ?? 0 },
      };
    },
  };
}
