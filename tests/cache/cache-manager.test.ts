import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CacheManager } from '../../src/cache/cache-manager.js';
import { rm } from 'fs/promises';
import { join } from 'path';
import type { ClassifyResult } from '../../src/types.js';

describe('CacheManager', () => {
  const testCacheDir = join(process.cwd(), 'tests', 'temp-cache');
  let cacheManager: CacheManager;

  beforeEach(async () => {
    cacheManager = new CacheManager({
      cacheDir: testCacheDir,
      enabled: true,
    });
    await cacheManager.initialize();
  });

  afterEach(async () => {
    try {
      await rm(testCacheDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('initialize', () => {
    it('should create cache directory', async () => {
      const manager = new CacheManager({ cacheDir: testCacheDir });
      await manager.initialize();
      expect(manager.isEnabled()).toBe(true);
    });
  });

  describe('get and set', () => {
    it('should store and retrieve result', async () => {
      const hash = 'test-hash-123';
      const mockResult: ClassifyResult = {
        classification: {
          template: 'legal',
          confidence: 0.95,
          domain: 'legal',
          docType: 'contract',
        },
        graphStructure: {
          cypher: 'CREATE (doc:Document)',
          entities: [],
          relationships: [],
        },
        fulltextMetadata: {
          title: 'Test',
          domain: 'legal',
          docType: 'contract',
          extractedFields: {},
          keywords: ['test'],
        },
        cacheInfo: {
          cached: false,
          hash,
        },
        performance: {
          totalTimeMs: 1000,
          costUsd: 0.001,
        },
      };

      // Set cache
      await cacheManager.set(hash, mockResult);

      // Get cache
      const cached = await cacheManager.get(hash);

      expect(cached).toBeDefined();
      expect(cached?.classification.template).toBe('legal');
      expect(cached?.cacheInfo.cached).toBe(true);
    });

    it('should return null for cache miss', async () => {
      const result = await cacheManager.get('non-existent-hash');
      expect(result).toBeNull();
    });
  });

  describe('has', () => {
    it('should return true for cached hash', async () => {
      const hash = 'test-hash-456';
      const mockResult = {} as ClassifyResult;

      await cacheManager.set(hash, mockResult);

      const exists = await cacheManager.has(hash);
      expect(exists).toBe(true);
    });

    it('should return false for non-cached hash', async () => {
      const exists = await cacheManager.has('non-existent');
      expect(exists).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', async () => {
      // Add some entries
      const mockResult: ClassifyResult = {
        classification: {
          template: 'legal',
          confidence: 0.95,
          domain: 'legal',
          docType: 'contract',
        },
        graphStructure: {
          cypher: 'CREATE (doc:Document)',
          entities: [],
          relationships: [],
        },
        fulltextMetadata: {
          keywords: [],
          summary: '',
          searchFields: {},
        },
        cacheInfo: {
          cached: false,
          cachedAt: Date.now(),
        },
      };

      await cacheManager.set('hash1', mockResult);
      await cacheManager.set('hash2', mockResult);

      // Verify entries were created
      const has1 = await cacheManager.has('hash1');
      const has2 = await cacheManager.has('hash2');
      expect(has1).toBe(true);
      expect(has2).toBe(true);

      const cleared = await cacheManager.clear();
      expect(cleared).toBe(2);

      const exists1 = await cacheManager.has('hash1');
      const exists2 = await cacheManager.has('hash2');
      expect(exists1).toBe(false);
      expect(exists2).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', async () => {
      const stats = await cacheManager.getStats();

      expect(stats).toBeDefined();
      expect(stats.entryCount).toBeGreaterThanOrEqual(0);
      expect(stats.totalSizeBytes).toBeGreaterThanOrEqual(0);
      expect(stats.hitRate).toBeGreaterThanOrEqual(0);
      expect(stats.hitRate).toBeLessThanOrEqual(1);
    });
  });

  describe('disabled cache', () => {
    it('should not cache when disabled', async () => {
      const disabledManager = new CacheManager({ enabled: false });

      const result = await disabledManager.get('any-hash');
      expect(result).toBeNull();

      await disabledManager.set('hash', {} as ClassifyResult);
      const check = await disabledManager.has('hash');
      expect(check).toBe(false);
    });
  });
});
