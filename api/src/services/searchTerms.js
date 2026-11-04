const STOPWORDS = new Set([
  'a', 'ai', 'al', 'ale', 'am', 'ar', 'are', 'as', 'au', 'ca', 'cand', 'care', 'cat', 'cate',
  'ce', 'cea', 'cei', 'cel', 'cele', 'cine', 'cu', 'cum', 'da', 'dar', 'de', 'despre', 'din',
  'dupa', 'e', 'ea', 'ei', 'el', 'este', 'eu', 'fi', 'fie', 'fost', 'iar', 'il', 'imi', 'in',
  'intr', 'intre', 'la', 'le', 'lor', 'lui', 'ma', 'mai', 'mea', 'meu', 'mi', 'ne', 'nu', 'o',
  'or', 'ori', 'pe', 'pentru', 'poate', 'pot', 'prin', 'sa', 'sau', 'se', 'si', 'sunt', 'ta',
  'tau', 'te', 'trebuie', 'tu', 'un', 'una', 'unde', 'unei', 'unor', 'unui', 'va', 'voi', 'vreau',
]);

export function toSearchTerms(text) {
  const words = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
  return [...new Set(words)];
}
