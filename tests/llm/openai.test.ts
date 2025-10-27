import { describe, it, expect } from 'vitest';
import { OpenAIProvider } from '../../src/llm/providers/openai.js';

describe('OpenAIProvider', () => {
  describe('constructor', () => {
    it('should create instance with valid config', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
      });

      expect(provider.name).toBe('openai');
      expect(provider.defaultModel).toBe('gpt-4o-mini');
    });

    it('should throw without API key', () => {
      expect(() =>
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
        model: 'gpt-4o-mini',
      });

      expect(provider.supportedModels).toContain('gpt-4o');
      expect(provider.supportedModels).toContain('gpt-4o-mini');
      expect(provider.supportedModels).toContain('gpt-4-turbo');
      expect(provider.supportedModels).toContain('gpt-4');
      expect(provider.supportedModels).toContain('gpt-3.5-turbo');
    });
  });

  describe('getPricing', () => {
    it('should return correct pricing for gpt-4o-mini', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
      });

      const pricing = provider.getPricing('gpt-4o-mini');
      expect(pricing.input).toBe(0.15);
      expect(pricing.output).toBe(0.6);
    });

    it('should return correct pricing for gpt-4o', () => {
      const provider = new OpenAIProvider({
        apiKey: 'test-key',
        model: 'gpt-4o',
      });

      const pricing = provider.getPricing('gpt-4o');
      expect(pricing.input).toBe(2.5);
      expect(pricing.output).toBe(10.0);
    });
  });
});

