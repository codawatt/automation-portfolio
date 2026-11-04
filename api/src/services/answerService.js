import { AiProviderError } from '../adapters/aiProviderError.js';
import { buildPrompt } from './prompt.js';
import { checkAnswer, looksLikeInstruction } from './answerGuard.js';

const FALLBACK_TEXT = {
  no_documents: 'Nu găsesc informația în baza demonstrativă.',
  no_answer: 'Nu găsesc informația în baza demonstrativă.',
  unknown_source: 'Nu pot oferi un răspuns verificat pe baza documentelor disponibile.',
  price_claim: 'Nu pot oferi informații despre prețuri. Te rog să verifici cu departamentul responsabil.',
};

function fallback(status, reason) {
  return { status, grounded: false, answer: FALLBACK_TEXT[reason], sources: [], reason };
}

export function estimateCost(usage, pricing) {
  const cost = (usage.in * pricing.inPerMillion + usage.out * pricing.outPerMillion) / 1_000_000;
  return Math.round(cost * 1e8) / 1e8;
}

export function createAnswerService({ knowledgeService, aiProvider, aiLogRepository, pricing }) {
  return {
    async answer({ question, correlationId }) {
      const started = Date.now();
      const found = await knowledgeService.search(question);
      const quarantined = found.filter((doc) => looksLikeInstruction(doc.excerpt)).map((doc) => doc.id);
      const documents = found.filter((doc) => !quarantined.includes(doc.id));

      let outcome;
      let usage = { in: 0, out: 0 };

      if (documents.length === 0) {
        outcome = fallback('NO_DOCUMENTS', 'no_documents');
      } else {
        try {
          const reply = await aiProvider.answer(buildPrompt({ question, documents }));
          usage = reply.usage;
          const check = checkAnswer(reply, documents.map((doc) => doc.id));
          outcome = check.ok
            ? { status: 'ANSWERED', grounded: true, answer: reply.text, sources: check.sources }
            : fallback('REJECTED', check.reason);
        } catch (err) {
          if (!(err instanceof AiProviderError)) throw err;
          console.error(`AI provider error [${correlationId}]: ${err.code}`);
          outcome = { status: 'AI_ERROR', grounded: false, answer: null, sources: [], reason: err.code };
        }
      }

      const result = {
        ...outcome,
        quarantined,
        model: documents.length > 0 ? aiProvider.model : null,
        tokensIn: usage.in,
        tokensOut: usage.out,
        estimatedCostUsd: estimateCost(usage, pricing),
        durationMs: Date.now() - started,
      };

      try {
        await aiLogRepository.insert({ correlationId, ...result });
      } catch (err) {
        console.error(`AI log insert failed [${correlationId}]: ${err.message}`);
      }
      return result;
    },
  };
}
