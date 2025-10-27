import { describe, it, expect } from 'vitest';
import { DeepSeekProvider } from '../../src/llm/providers/deepseek.js';

describe('DeepSeekProvider', () => {
  describe('constructor', () => {
    it('should create instance with valid config', () => {
      const provider = new DeepSeekProvider({
        apiKey: 'test-key',
        model: 'deepseek-chat',
      });

      expect(provider.name).toBe('deepseek');
      expect(provider.defaultModel).toBe('deepseek-chat');
    });

    it('should throw without API key', () => {
      expect(() =>
        new DeepSeekProvider({
          apiKey: '',
          model: 'deepseek-chat',
        })
      ).toThrow('API key required');
    });
  });

  describe('supportedModels', () => {
    it('should list supported models', () => {
      const provider = new DeepSeekProvider({
        apiKey: 'test-key',
        model: 'deepseek-chat',
      });

      expect(provider.supportedModels).toContain('deepseek-chat');
      expect(provider.supportedModels).toContain('deepseek-reasoner');
    });
  });

  describe('getPricing', () => {
    it('should return correct pricing', () => {
      const provider = new DeepSeekProvider({
        apiKey: 'test-key',
        model: 'deepseek-chat',
      });

      const pricing = provider.getPricing('deepseek-chat');
      expect(pricing.input).toBe(0.14);
      expect(pricing.output).toBe(0.28);
    });
  });
});

