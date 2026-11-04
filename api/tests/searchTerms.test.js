import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toSearchTerms } from '../src/services/searchTerms.js';

test('removes stopwords and punctuation', () => {
  assert.deepEqual(toSearchTerms('Cum deschid un tichet?'), ['deschid', 'tichet']);
});

test('removes Romanian diacritics, including ș and ț', () => {
  assert.deepEqual(toSearchTerms('Care este capitala Franței?'), ['capitala', 'frantei']);
  assert.deepEqual(toSearchTerms('Șasiu și daună'), ['sasiu', 'dauna']);
});

test('returns no terms for a question made only of stopwords', () => {
  assert.deepEqual(toSearchTerms('Care este?'), []);
});
