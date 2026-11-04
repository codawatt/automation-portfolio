import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateQuestion } from '../src/validators/questionValidator.js';

test('accepts and trims a valid question', () => {
  assert.deepEqual(validateQuestion({ question: '  Cum deschid un tichet?  ' }),
    { valid: true, value: 'Cum deschid un tichet?' });
});

test('rejects missing, empty and too long questions', () => {
  assert.equal(validateQuestion({}).valid, false);
  assert.equal(validateQuestion({ question: '   ' }).valid, false);
  assert.equal(validateQuestion({ question: 'a'.repeat(301) }).valid, false);
});
