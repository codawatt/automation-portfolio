import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLeadService } from '../src/services/leadService.js';

const classifier = { classify: () => 'RCA' };
const input = { requestId: 'lead-1', correlationId: 'run-1', message: 'Vreau RCA' };

test('new lead returns duplicate=false', async () => {
  const leadRepository = {
    insertIfAbsent: async () => ({ id: '101', category: 'RCA', status: 'NEW' }),
    findByRequestId: async () => { throw new Error('should not be called'); },
  };
  const service = createLeadService({ leadRepository, classifier });

  const lead = await service.createLead(input);

  assert.deepEqual(lead, { leadId: 101, category: 'RCA', status: 'NEW', duplicate: false });
});

test('replayed requestId returns the same lead with duplicate=true', async () => {
  const leadRepository = {
    insertIfAbsent: async () => null,
    findByRequestId: async () => ({ id: '101', category: 'RCA', status: 'NEW' }),
  };
  const service = createLeadService({ leadRepository, classifier });

  const lead = await service.createLead(input);

  assert.equal(lead.leadId, 101);
  assert.equal(lead.duplicate, true);
});

test('listLeads maps database rows to the API format', async () => {
  const leadRepository = {
    list: async () => [{
      id: '7', request_id: 'lead-7', message: 'Salut', category: 'GENERAL',
      status: 'NEW', notify_status: 'PENDING', created_at: '2026-10-29T13:49:29.542Z',
    }],
  };
  const service = createLeadService({ leadRepository, classifier });

  const [lead] = await service.listLeads(20);

  assert.equal(lead.leadId, 7);
  assert.equal(lead.requestId, 'lead-7');
  assert.equal(lead.notifyStatus, 'PENDING');
  assert.equal('request_id' in lead, false);
});
