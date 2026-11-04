const MAX_QUESTION_LENGTH = 300;

export function validateQuestion(body) {
  const question = body?.question;
  if (typeof question !== 'string') {
    return { valid: false, errors: ['question must be a string'] };
  }
  const trimmed = question.trim();
  if (trimmed.length === 0) return { valid: false, errors: ['question must not be empty'] };
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return { valid: false, errors: [`question must be at most ${MAX_QUESTION_LENGTH} characters`] };
  }
  return { valid: true, value: trimmed };
}
