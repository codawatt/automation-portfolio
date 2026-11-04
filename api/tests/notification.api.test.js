import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const pool = { query: async () => ({}) };

function appWith(updateResult) {
  const leadService = { updateNotifyStatus: async () => updateResult };
  return createApp({ pool, leadService });
}

test('PATCH notification returns 200 with the new status', async () => {
  const res = await request(appWith({ leadId: 1, notifyStatus: 'SENT' }))
    .patch('/api/leads/1/notification').send({ status: 'SENT' });
  assert.equal(res.status, 200);
  assert.equal(res.body.notifyStatus, 'SENT');
});

test('PATCH notification rejects an unknown status', async () => {
  const res = await request(appWith(null))
    .patch('/api/leads/1/notification').send({ status: 'DONE' });
  assert.equal(res.status, 400);
});

test('PATCH notification returns 404 for a missing lead', async () => {
  const res = await request(appWith(null))
    .patch('/api/leads/999/notification').send({ status: 'SENT' });
  assert.equal(res.status, 404);
});
