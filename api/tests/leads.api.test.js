import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const pool = { query: async () => ({}) };
const body = { requestId: 'lead-1', correlationId: 'run-1', message: 'Vreau RCA' };

function appWith(createLeadResult) {
  const leadService = { createLead: async () => createLeadResult, listLeads: async () => [] };
  return createApp({ pool, leadService });
}

test('POST /api/leads returns 201 for a new lead', async () => {
  const app = appWith({ leadId: 1, category: 'RCA', status: 'NEW', duplicate: false });
  const res = await request(app).post('/api/leads').send(body);
  assert.equal(res.status, 201);
});

test('POST /api/leads returns 200 for a duplicate', async () => {
  const app = appWith({ leadId: 1, category: 'RCA', status: 'NEW', duplicate: true });
  const res = await request(app).post('/api/leads').send(body);
  assert.equal(res.status, 200);
  assert.equal(res.body.duplicate, true);
});

test('POST /api/leads returns 400 for empty message', async () => {
  const res = await request(appWith(null)).post('/api/leads').send({ ...body, message: '' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'validation_error');
});

test('POST /api/leads returns 400 for malformed JSON', async () => {
  const res = await request(appWith(null))
    .post('/api/leads')
    .set('Content-Type', 'application/json')
    .send('{"message": ');
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'invalid_json');
});
