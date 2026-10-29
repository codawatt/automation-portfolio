const RULES = [
  { category: 'RCA', pattern: /\brca\b/i },
  { category: 'CASCO', pattern: /\bcasco\b/i },
];

export const ruleClassifier = {
  classify(message) {
    const rule = RULES.find((r) => r.pattern.test(message));
    return rule ? rule.category : 'GENERAL';
  },
};
