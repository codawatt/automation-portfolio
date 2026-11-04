import { validateQuestion } from '../validators/questionValidator.js';

export function createKnowledgeController({ knowledgeService }) {
  return {
    async search(req, res) {
      const result = validateQuestion(req.body);
      if (!result.valid) {
        return res.status(400).json({ error: 'validation_error', details: result.errors });
      }
      const results = await knowledgeService.search(result.value);
      res.json({ results });
    },
  };
}
