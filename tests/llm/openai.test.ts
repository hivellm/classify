import { describe, it, expect } from 'vitest';
import { OpenAIProvider } from '../../src/llm/providers/openai.js';

describe('OpenAIProvider', () => {
  describe('constructor', () => {
    it('should create instance with valid config', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-5-mini',
      });

      expect(provider.name).toBe('openai');
      expect(provider.defaultModel).toBe('gpt-5-mini');
    });

    it('should throw without API key', () => {
      expect(
        () =>
          new OpenAIProvider({
            apiKey: '',
            model: 'gpt-4o-mini',
          })
      ).toThrow('API key required');
    });
  });

  describe('supportedModels', () => {
    it('should list supported models', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-5-mini',
      });

      expect(provider.supportedModels).toContain('gpt-5-mini');
      expect(provider.supportedModels).toContain('gpt-5-nano');
      expect(provider.supportedModels).toContain('gpt-4o-mini');
      expect(provider.supportedModels).toContain('o3-mini');
    });
  });

  describe('getPricing', () => {
    it('should return correct pricing for gpt-5-mini', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-5-mini',
      });

      const pricing = provider.getPricing('gpt-5-mini');
      expect(pricing.input).toBe(0.25);
      expect(pricing.output).toBe(2.0);
    });

    it('should return correct pricing for gpt-5-nano', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-5-nano',
      });

      const pricing = provider.getPricing('gpt-5-nano');
      expect(pricing.input).toBe(0.05);
      expect(pricing.output).toBe(0.4);
    });
  });
});
