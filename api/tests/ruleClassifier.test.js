import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ruleClassifier } from '../src/strategies/ruleClassifier.js';

test('detects RCA regardless of case', () => {
  assert.equal(ruleClassifier.classify('Vreau o oferta rca'), 'RCA');
  assert.equal(ruleClassifier.classify('Cat costa RCA-ul?'), 'RCA');
});

test('detects CASCO', () => {
  assert.equal(ruleClassifier.classify('Am nevoie de CASCO'), 'CASCO');
});

test('falls back to GENERAL', () => {
  assert.equal(ruleClassifier.classify('Salut'), 'GENERAL');
});

test('does not match RCA inside other words', () => {
  assert.equal(ruleClassifier.classify('Caut un loc de parcare'), 'GENERAL');
});
