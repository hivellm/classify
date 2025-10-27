import { describe, it, expect } from 'vitest';
import { XAIProvider } from '../../src/llm/providers/xai.js';

describe('XAIProvider', () => {
  it('should create provider with API key', () => {
    const provider = new XAIProvider({
      apiKey: 'test-key',
      model: 'grok-3',
    });

    expect(provider.name).toBe('xai');
    expect(provider.defaultModel).toBe('grok-3');
    expect(provider.supportedModels).toContain('grok-3');
    expect(provider.supportedModels).toContain('grok-3-mini');
  });

  it('should get correct pricing', () => {
    const provider = new XAIProvider({
      apiKey: 'test-key',
      model: 'grok-3',
    });

    const pricing = provider.getPricing('grok-3');
    expect(pricing.input).toBe(3.0);
    expect(pricing.output).toBe(12.0);
  });
});
