import { validateLeadInput } from '../validators/leadValidator.js';

export function createLeadController({ leadService }) {
  return {
    async create(req, res) {
      const result = validateLeadInput(req.body);
      if (!result.valid) {
        return res.status(400).json({ error: 'validation_error', details: result.errors });
      }
      const lead = await leadService.createLead(result.value);
      res.status(lead.duplicate ? 200 : 201).json(lead);
    },

    async list(req, res) {
      const requested = Number.parseInt(req.query.limit, 10) || 20;
      const limit = Math.min(Math.max(requested, 1), 100);
      res.json(await leadService.listLeads(limit));
    },
    async updateNotification(req, res) {
      const { leadId } = req.params;
      const status = req.body?.status;
      if (!/^\d+$/.test(leadId) || !['SENT', 'FAILED'].includes(status)) {
        return res.status(400).json({
          error: 'validation_error',
          details: ['leadId must be a positive integer', 'status must be SENT or FAILED'],
        });
      }
      const result = await leadService.updateNotifyStatus(Number(leadId), status);
      if (!result) return res.status(404).json({ error: 'not_found' });
      res.json(result);
    },
  };
}
