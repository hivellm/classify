import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClassifyClient } from '../src/client.js';

describe('ClassifyClient', () => {
  let client: ClassifyClient;

  beforeEach(() => {
    client = new ClassifyClient({
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: 'test-key',
      cacheEnabled: true,
      cacheDir: '.test-cache',
    });
  });

  describe('constructor', () => {
    it('should create instance with default options', (): void => {
      const defaultClient = new ClassifyClient();
      expect(defaultClient).toBeInstanceOf(ClassifyClient);
    });

    it('should create instance with custom options', (): void => {
      expect(client).toBeInstanceOf(ClassifyClient);
    });

    it('should merge provided options with defaults', (): void => {
      const customClient = new ClassifyClient({
        provider: 'openai',
        model: 'gpt-4o-mini',
      });
      expect(customClient).toBeInstanceOf(ClassifyClient);
    });

    it('should warn when no API key is provided', (): void => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      new ClassifyClient({ apiKey: '' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Warning: No API key provided. Set DEEPSEEK_API_KEY or pass apiKey in options.'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('classify', () => {
    it('should throw not implemented error', async (): Promise<void> => {
      await expect(client.classify('test.pdf')).rejects.toThrow('Not implemented yet');
    });

    it('should include file path in error message', async (): Promise<void> => {
      await expect(client.classify('document.pdf')).rejects.toThrow('document.pdf');
    });
  });
});

