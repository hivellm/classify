import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import type { ClassifyResult } from '../types.js';

/**
 * Cache entry
 */
interface CacheEntry {
  /** Document hash */
  hash: string;

  /** Classification result */
  result: ClassifyResult;

  /** Cached at timestamp */
  cachedAt: number;

  /** Last accessed timestamp */
  accessedAt: number;

  /** Access count */
  accessCount: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total cache size in bytes */
  totalSizeBytes: number;

  /** Number of cached entries */
  entryCount: number;

  /** Cache hit count */
  hits: number;

  /** Cache miss count */
  misses: number;

  /** Cache hit rate (0-1) */
  hitRate: number;

  /** Total cost saved (USD) */
  costSaved: number;
}

/**
 * Cache Manager
 * SHA256-based persistent caching system
 */
export class CacheManager {
  private cacheDir: string;
  private enabled: boolean;
  private stats = {
    hits: 0,
    misses: 0,
    costSaved: 0,
  };

  constructor(options: { cacheDir?: string; enabled?: boolean } = {}) {
    this.cacheDir = options.cacheDir ?? '.classify-cache';
    this.enabled = options.enabled ?? true;
  }

  /**
   * Initialize cache directory
   */
  async initialize(): Promise<void> {
    if (!this.enabled) return;

    try {
      await mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.warn(`Failed to create cache directory: ${error}`);
      this.enabled = false;
    }
  }

  /**
   * Get cached result by hash
   */
  async get(hash: string): Promise<ClassifyResult | null> {
    if (!this.enabled) return null;

    try {
      const cachePath = this.getCachePath(hash);
      const content = await readFile(cachePath, 'utf-8');
      const entry: CacheEntry = JSON.parse(content);

      // Update access stats
      entry.accessedAt = Date.now();
      entry.accessCount++;
      await this.writeEntry(hash, entry);

      // Update stats
      this.stats.hits++;
      this.stats.costSaved += entry.result.performance.costUsd ?? 0;

      // Mark result as cached
      const result = { ...entry.result };
      result.cacheInfo.cached = true;

      return result;
    } catch (error) {
      // Cache miss
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Store result in cache
   */
  async set(hash: string, result: ClassifyResult): Promise<void> {
    if (!this.enabled) return;

    try {
      const entry: CacheEntry = {
        hash,
        result,
        cachedAt: Date.now(),
        accessedAt: Date.now(),
        accessCount: 0,
      };

      await this.writeEntry(hash, entry);
    } catch (error) {
      console.warn(`Failed to write cache entry: ${error}`);
    }
  }

  /**
   * Check if hash exists in cache
   */
  async has(hash: string): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      const cachePath = this.getCachePath(hash);
      await stat(cachePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<number> {
    if (!this.enabled) return 0;

    try {
      const files = await readdir(this.cacheDir);
      const cacheFiles = files.filter((f) => f.endsWith('.json'));

      for (const file of cacheFiles) {
        await unlink(join(this.cacheDir, file));
      }

      return cacheFiles.length;
    } catch (error) {
      console.warn(`Failed to clear cache: ${error}`);
      return 0;
    }
  }

  /**
   * Clear cache entries older than specified days
   */
  async clearOlderThan(days: number): Promise<number> {
    if (!this.enabled) return 0;

    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    let cleared = 0;

    try {
      const files = await readdir(this.cacheDir);
      const cacheFiles = files.filter((f) => f.endsWith('.json'));

      for (const file of cacheFiles) {
        const filePath = join(this.cacheDir, file);
        const content = await readFile(filePath, 'utf-8');
        const entry: CacheEntry = JSON.parse(content);

        if (entry.cachedAt < cutoffTime) {
          await unlink(filePath);
          cleared++;
        }
      }

      return cleared;
    } catch (error) {
      console.warn(`Failed to clear old cache entries: ${error}`);
      return cleared;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    if (!this.enabled) {
      return {
        totalSizeBytes: 0,
        entryCount: 0,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: 0,
        costSaved: this.stats.costSaved,
      };
    }

    try {
      const files = await readdir(this.cacheDir);
      const cacheFiles = files.filter((f) => f.endsWith('.json'));

      let totalSize = 0;
      for (const file of cacheFiles) {
        const filePath = join(this.cacheDir, file);
        const fileStats = await stat(filePath);
        totalSize += fileStats.size;
      }

      const total = this.stats.hits + this.stats.misses;
      const hitRate = total > 0 ? this.stats.hits / total : 0;

      return {
        totalSizeBytes: totalSize,
        entryCount: cacheFiles.length,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate,
        costSaved: this.stats.costSaved,
      };
    } catch (error) {
      console.warn(`Failed to get cache stats: ${error}`);
      return {
        totalSizeBytes: 0,
        entryCount: 0,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: 0,
        costSaved: this.stats.costSaved,
      };
    }
  }

  /**
   * Get cache path for hash
   */
  private getCachePath(hash: string): string {
    return join(this.cacheDir, `${hash}.json`);
  }

  /**
   * Write cache entry
   */
  private async writeEntry(hash: string, entry: CacheEntry): Promise<void> {
    const cachePath = this.getCachePath(hash);
    await writeFile(cachePath, JSON.stringify(entry, null, 2));
  }

  /**
   * Check if cache is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

