export class AiProviderError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AiProviderError';
    this.code = code;
  }
}
