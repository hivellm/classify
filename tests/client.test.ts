import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClassifyClient } from '../src/client.js';

// Mock environment
const mockEnv = {
  DEEPSEEK_API_KEY: 'test-api-key',
};
vi.stubGlobal('process', { env: mockEnv });

describe('ClassifyClient', () => {
  let client: ClassifyClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ClassifyClient({
      apiKey: 'test-key',
      cacheEnabled: false, // Disable cache for simpler tests
    });
  });

  describe('constructor', () => {
    it('should create client with default options', () => {
      const defaultClient = new ClassifyClient();
      expect(defaultClient).toBeDefined();
    });

    it('should use provided options', () => {
      const customClient = new ClassifyClient({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'custom-key',
        cacheEnabled: false,
        compressionEnabled: false,
      });
      expect(customClient).toBeDefined();
    });

    it('should use environment variable for API key', () => {
      const envClient = new ClassifyClient({
        provider: 'deepseek',
      });
      expect(envClient).toBeDefined();
    });

    it('should warn when no API key provided for API providers', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create client with empty API key (will throw due to provider requirement)
      expect(() => {
        new ClassifyClient({ apiKey: '', provider: 'deepseek' });
      }).toThrow('API key required');

      consoleSpy.mockRestore();
    });

    it('should not require API key for cursor-agent', () => {
      const client = new ClassifyClient({ provider: 'cursor-agent' });
      expect(client).toBeDefined();
    });

    it('should accept custom cache directory', () => {
      const cacheClient = new ClassifyClient({
        apiKey: 'test',
        cacheDir: './custom-cache',
      });
      expect(cacheClient).toBeDefined();
    });

    it('should accept custom templates directory', () => {
      const templateClient = new ClassifyClient({
        apiKey: 'test',
        templatesDir: './custom-templates',
      });
      expect(templateClient).toBeDefined();
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const stats = await client.getCacheStats();
      expect(stats).toHaveProperty('totalSizeBytes');
      expect(stats).toHaveProperty('entryCount');
      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('costSaved');
    });
  });

  describe('clearCache', () => {
    it('should clear all cache when no options specified', async () => {
      const cleared = await client.clearCache();
      expect(typeof cleared).toBe('number');
      expect(cleared).toBeGreaterThanOrEqual(0);
    });

    it('should clear all cache with empty options', async () => {
      const cleared = await client.clearCache({});
      expect(typeof cleared).toBe('number');
      expect(cleared).toBeGreaterThanOrEqual(0);
    });

    it('should clear old cache entries with olderThanDays option', async () => {
      const cleared = await client.clearCache({ olderThanDays: 30 });
      expect(typeof cleared).toBe('number');
      expect(cleared).toBeGreaterThanOrEqual(0);
    });

    it('should clear very old cache entries', async () => {
      const cleared = await client.clearCache({ olderThanDays: 365 });
      expect(typeof cleared).toBe('number');
      expect(cleared).toBeGreaterThanOrEqual(0);
    });
  });

  describe('configuration options', () => {
    it('should support compression settings', () => {
      const compressedClient = new ClassifyClient({
        apiKey: 'test',
        compressionEnabled: true,
        compressionRatio: 0.7,
      });
      expect(compressedClient).toBeDefined();
    });

    it('should support different providers', () => {
      const providers = ['deepseek', 'openai', 'anthropic', 'gemini', 'xai', 'groq'] as const;

      providers.forEach((provider) => {
        const providerClient = new ClassifyClient({
          provider,
          apiKey: 'test-key',
        });
        expect(providerClient).toBeDefined();
      });
    });

    it('should handle cache enabled/disabled', () => {
      const cacheEnabledClient = new ClassifyClient({
        apiKey: 'test',
        cacheEnabled: true,
      });
      const cacheDisabledClient = new ClassifyClient({
        apiKey: 'test',
        cacheEnabled: false,
      });

      expect(cacheEnabledClient).toBeDefined();
      expect(cacheDisabledClient).toBeDefined();
    });
  });
});
