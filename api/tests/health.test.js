import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

test('GET /health returns 200 when the database responds', async () => {
  const fakePool = { query: async () => ({ rows: [{ ok: 1 }] }) };
  const app = createApp({ pool: fakePool });

  const res = await request(app).get('/health');

  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.db, 'ok');
  assert.equal(typeof res.body.durationMs, 'number');
});

test('GET /health returns 503 when the database fails', async () => {
  const fakePool = {
    query: async () => { throw new Error('connection refused'); },
  };
  const app = createApp({ pool: fakePool });

  const res = await request(app).get('/health');

  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { status: 'degraded', db: 'unreachable' });
});

test('unknown route returns 404', async () => {
  const app = createApp({ pool: { query: async () => ({}) } });
  const res = await request(app).get('/does-not-exist');
  assert.equal(res.status, 404);
});
