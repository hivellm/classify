import { describe, it, expect } from 'vitest';
import { GeminiProvider } from '../../src/llm/providers/gemini.js';

describe('GeminiProvider', () => {
  it('should create provider with API key', () => {
    const provider = new GeminiProvider({
      apiKey: 'test-key',
      model: 'gemini-2.5-flash',
    });

    expect(provider.name).toBe('gemini');
    expect(provider.defaultModel).toBe('gemini-2.5-flash');
    expect(provider.supportedModels).toContain('gemini-2.5-flash');
  });

  it('should get correct pricing', () => {
    const provider = new GeminiProvider({
      apiKey: 'test-key',
      model: 'gemini-2.5-flash',
    });

    const pricing = provider.getPricing('gemini-2.5-flash');
    expect(pricing.input).toBe(0.05);
    expect(pricing.output).toBe(0.2);
  });
});
