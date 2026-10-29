const ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;
const MAX_MESSAGE_LENGTH = 500;

export function validateLeadInput(body) {
  const input = body ?? {};
  const errors = [];

  if (typeof input.requestId !== 'string' || !ID_PATTERN.test(input.requestId)) {
    errors.push('requestId must be 1-100 chars: letters, digits, - or _');
  }
  if (typeof input.correlationId !== 'string' || !ID_PATTERN.test(input.correlationId)) {
    errors.push('correlationId must be 1-100 chars: letters, digits, - or _');
  }

  let message = '';
  if (typeof input.message !== 'string') {
    errors.push('message must be a string');
  } else {
    message = input.message.trim();
    if (message.length === 0) errors.push('message must not be empty');
    if (message.length > MAX_MESSAGE_LENGTH) {
      errors.push(`message must be at most ${MAX_MESSAGE_LENGTH} characters`);
    }
  }

  if (errors.length > 0) return { valid: false, errors };
  return {
    valid: true,
    value: { requestId: input.requestId, correlationId: input.correlationId, message },
  };
}
