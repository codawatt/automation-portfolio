function toLeadResponse(row, duplicate) {
  return {
    leadId: Number(row.id),
    category: row.category,
    status: row.status,
    duplicate,
  };
}

export function createLeadService({ leadRepository, classifier }) {
  return {
    async createLead(input) {
      const category = classifier.classify(input.message);
      const created = await leadRepository.insertIfAbsent({ ...input, category });
      if (created) return toLeadResponse(created, false);

      const existing = await leadRepository.findByRequestId(input.requestId);
      return toLeadResponse(existing, true);
    },
    async listLeads(limit) {
      const rows = await leadRepository.list(limit);
      return rows.map((row) => ({
        leadId: Number(row.id),
        requestId: row.request_id,
        message: row.message,
        category: row.category,
        status: row.status,
        notifyStatus: row.notify_status,
        createdAt: row.created_at,
      }));
    },
  };
}
