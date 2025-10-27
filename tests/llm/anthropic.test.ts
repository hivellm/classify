import { describe, it, expect } from 'vitest';
import { AnthropicProvider } from '../../src/llm/providers/anthropic.js';

describe('AnthropicProvider', () => {
  it('should create provider with API key', () => {
    const provider = new AnthropicProvider({
      apiKey: 'test-key',
      model: 'claude-3-5-haiku-20241022',
    });

    expect(provider.name).toBe('anthropic');
    expect(provider.defaultModel).toBe('claude-3-5-haiku-20241022');
    expect(provider.supportedModels).toContain('claude-4-5-haiku');
  });

  it('should get correct pricing', () => {
    const provider = new AnthropicProvider({
      apiKey: 'test-key',
      model: 'claude-3-5-haiku-20241022',
    });

    const pricing = provider.getPricing('claude-4-5-haiku');
    expect(pricing.input).toBe(0.5);
    expect(pricing.output).toBe(2.0);
  });
});
