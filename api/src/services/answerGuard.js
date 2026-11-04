import { normalizeText } from './searchTerms.js';

const INSTRUCTION_PATTERN = /ignor\w*\s+(toate\s+)?(regulile|instructiunile)|regulile anterioare/;
const PRICE_PATTERN = /gratuit|\bpret|\bcost|\d+\s*(lei|ron|eur|euro)\b/;

export function looksLikeInstruction(text) {
  return INSTRUCTION_PATTERN.test(normalizeText(text));
}

export function checkAnswer({ text, sourceIds }, allowedIds) {
  if (!text || sourceIds.length === 0) return { ok: false, reason: 'no_answer' };
  if (sourceIds.some((id) => !allowedIds.includes(id))) return { ok: false, reason: 'unknown_source' };
  if (PRICE_PATTERN.test(normalizeText(text))) return { ok: false, reason: 'price_claim' };
  return { ok: true, sources: [...new Set(sourceIds)] };
}
