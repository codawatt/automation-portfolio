import { toSearchTerms } from './searchTerms.js';

const MAX_RESULTS = 3;

export function createKnowledgeService({ faqRepository }) {
  return {
    async search(question) {
      const terms = toSearchTerms(question);
      if (terms.length === 0) return [];

      const rows = await faqRepository.search(terms.join(' '), MAX_RESULTS);
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        excerpt: row.excerpt,
        score: Math.round(row.score * 10000) / 10000,
      }));
    },
  };
}
