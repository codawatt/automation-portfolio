import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLeadInput } from '../src/validators/leadValidator.js';

const valid = { requestId: 'lead-1', correlationId: 'run-1', message: 'Vreau RCA' };

test('accepts valid input and trims the message', () => {
  const result = validateLeadInput({ ...valid, message: '  Vreau RCA  ' });
  assert.equal(result.valid, true);
  assert.equal(result.value.message, 'Vreau RCA');
});

test('rejects empty or whitespace-only message', () => {
  assert.equal(validateLeadInput({ ...valid, message: '   ' }).valid, false);
});

test('rejects message longer than 500 characters', () => {
  assert.equal(validateLeadInput({ ...valid, message: 'a'.repeat(501) }).valid, false);
});

test('rejects non-string message and reports all errors', () => {
  const result = validateLeadInput({ message: 42 });
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 3);
});
