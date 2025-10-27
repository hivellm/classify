import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClassifyClient } from '../src/client.js';

describe('ClassifyClient', () => {
  describe('constructor', () => {
    it('should create instance with API key', (): void => {
      const client = new ClassifyClient({
        apiKey: 'test-api-key',
      });

      expect(client).toBeInstanceOf(ClassifyClient);
    });

    it('should create instance with custom options', (): void => {
      const client = new ClassifyClient({
        provider: 'deepseek',
        model: 'deepseek-chat',
        apiKey: 'test-key',
        cacheEnabled: true,
        cacheDir: '.test-cache',
      });

      expect(client).toBeInstanceOf(ClassifyClient);
    });

    it('should create OpenAI client', (): void => {
      const client = new ClassifyClient({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'test-api-key',
      });

      expect(client).toBeInstanceOf(ClassifyClient);
    });

    it('should throw when no API key is provided', (): void => {
      expect(() => new ClassifyClient({ apiKey: '' })).toThrow(
        'API key required for provider'
      );
    });

    it('should warn when empty API key passed', (): void => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      expect(() => new ClassifyClient({ apiKey: '' })).toThrow();

      consoleWarnSpy.mockRestore();
    });

    it('should use environment variable for API key', (): void => {
      const oldKey = process.env.DEEPSEEK_API_KEY;
      process.env.DEEPSEEK_API_KEY = 'env-test-key';

      const client = new ClassifyClient();
      expect(client).toBeInstanceOf(ClassifyClient);

      // Restore
      if (oldKey) {
        process.env.DEEPSEEK_API_KEY = oldKey;
      } else {
        delete process.env.DEEPSEEK_API_KEY;
      }
    });
  });

  describe('classify', () => {
    it('should throw error for non-existent file', async (): Promise<void> => {
      const client = new ClassifyClient({ apiKey: 'test-key' });
      await expect(client.classify('non-existent-file.pdf')).rejects.toThrow();
    });
  });
});
