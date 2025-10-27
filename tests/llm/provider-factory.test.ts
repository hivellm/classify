import { describe, it, expect } from 'vitest';
import { ProviderFactory } from '../../src/llm/provider-factory.js';
import { DeepSeekProvider } from '../../src/llm/providers/deepseek.js';
import { OpenAIProvider } from '../../src/llm/providers/openai.js';

describe('ProviderFactory', () => {
  describe('create', () => {
    it('should create DeepSeek provider', () => {
      const provider = ProviderFactory.create('deepseek', {
        apiKey: 'test-key',
      });

      expect(provider).toBeInstanceOf(DeepSeekProvider);
      expect(provider.name).toBe('deepseek');
      expect(provider.defaultModel).toBe('deepseek-chat');
    });

    it('should create OpenAI provider', () => {
      const provider = ProviderFactory.create('openai', {
        apiKey: 'test-key',
      });

      expect(provider).toBeInstanceOf(OpenAIProvider);
      expect(provider.name).toBe('openai');
      expect(provider.defaultModel).toBe('gpt-4o-mini');
    });

    it('should use custom model if provided', () => {
      const provider = ProviderFactory.create('openai', {
        apiKey: 'test-key',
        model: 'gpt-4o',
      });

      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should throw for unimplemented providers', () => {
      expect(() =>
        ProviderFactory.create('anthropic', { apiKey: 'test-key' })
      ).toThrow('not yet implemented');

      expect(() =>
        ProviderFactory.create('gemini', { apiKey: 'test-key' })
      ).toThrow('not yet implemented');
    });
  });

  describe('getDefaultModel', () => {
    it('should return correct default models', () => {
      expect(ProviderFactory.getDefaultModel('deepseek')).toBe('deepseek-chat');
      expect(ProviderFactory.getDefaultModel('openai')).toBe('gpt-4o-mini');
      expect(ProviderFactory.getDefaultModel('anthropic')).toBe('claude-3-5-haiku-latest');
      expect(ProviderFactory.getDefaultModel('gemini')).toBe('gemini-2.0-flash');
      expect(ProviderFactory.getDefaultModel('xai')).toBe('grok-3-mini-latest');
      expect(ProviderFactory.getDefaultModel('groq')).toBe('llama-3.1-8b-instant');
    });
  });

  describe('getApiKeyEnvVar', () => {
    it('should return correct environment variable names', () => {
      expect(ProviderFactory.getApiKeyEnvVar('deepseek')).toBe('DEEPSEEK_API_KEY');
      expect(ProviderFactory.getApiKeyEnvVar('openai')).toBe('OPENAI_API_KEY');
      expect(ProviderFactory.getApiKeyEnvVar('anthropic')).toBe('ANTHROPIC_API_KEY');
      expect(ProviderFactory.getApiKeyEnvVar('gemini')).toBe('GEMINI_API_KEY');
      expect(ProviderFactory.getApiKeyEnvVar('xai')).toBe('XAI_API_KEY');
      expect(ProviderFactory.getApiKeyEnvVar('groq')).toBe('GROQ_API_KEY');
    });
  });
});

