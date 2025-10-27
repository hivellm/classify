import { describe, it, expect } from 'vitest';
import { GroqProvider } from '../../src/llm/providers/groq.js';

describe('GroqProvider', () => {
  it('should create provider with API key', () => {
    const provider = new GroqProvider({
      apiKey: 'test-key',
      model: 'llama-3.3-70b-versatile',
    });

    expect(provider.name).toBe('groq');
    expect(provider.defaultModel).toBe('llama-3.3-70b-versatile');
    expect(provider.supportedModels).toContain('llama-3.3-70b-versatile');
  });

  it('should get correct pricing', () => {
    const provider = new GroqProvider({
      apiKey: 'test-key',
      model: 'llama-3.3-70b-versatile',
    });

    const pricing = provider.getPricing('llama-3.3-70b-versatile');
    expect(pricing.input).toBe(0.59);
    expect(pricing.output).toBe(0.79);
  });
});
