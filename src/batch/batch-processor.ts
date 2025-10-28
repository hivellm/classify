import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import type { ClassifyClient } from '../client.js';
import type { ClassifyResult } from '../types.js';

/**
 * Batch processing options
 */
export interface BatchOptions {
  /** Process subdirectories recursively */
  recursive?: boolean;

  /** Maximum concurrent classifications */
  concurrency?: number;

  /** File extensions to process (default: all supported) */
  extensions?: string[];

  /** Skip files that fail */
  continueOnError?: boolean;

  /** Callback called after each batch completes (for incremental indexing) */
  onBatchComplete?: (results: Array<{ filePath: string; result: ClassifyResult }>) => Promise<void>;

  /** Force specific template ID */
  templateId?: string;
}

/**
 * Batch processing result
 */
export interface BatchResult {
  /** Total files found */
  totalFiles: number;

  /** Successfully classified */
  successCount: number;

  /** Failed classifications */
  failureCount: number;

  /** Skipped files */
  skippedCount: number;

  /** Individual results */
  results: Array<{
    filePath: string;
    success: boolean;
    result?: ClassifyResult;
    error?: string;
  }>;

  /** Performance metrics */
  performance: {
    totalTimeMs: number;
    averageTimeMs: number;
    totalCost: number;
    averageCost: number;
    cacheHits: number;
    cacheMisses: number;
  };
}

/**
 * Batch Processor
 * Processes multiple documents with rate limiting and parallelization
 */
export class BatchProcessor {
  constructor(private client: ClassifyClient) {}

  /**
   * Process all files in a directory
   * @param directory - Directory path
   * @param options - Batch processing options
   * @returns Batch processing result
   */
  async processDirectory(directory: string, options: BatchOptions = {}): Promise<BatchResult> {
    const {
      recursive = false,
      concurrency = 4,
      extensions,
      continueOnError = true,
      onBatchComplete,
      templateId,
    } = options;

    const startTime = Date.now();

    // Collect all files
    const files = await this.collectFiles(directory, recursive, extensions);

    console.log(`📁 Found ${files.length} files to process`);
    console.log(`⚙️  Concurrency: ${concurrency}\n`);

    // Process files in parallel with concurrency limit
    const results: Array<{
      filePath: string;
      success: boolean;
      result?: ClassifyResult;
      error?: string;
    }> = [];

    let successCount = 0;
    let failureCount = 0;
    let totalCost = 0;
    let cacheHits = 0;
    let cacheMisses = 0;

    // Process in batches
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const batchNumber = Math.floor(i / concurrency) + 1;
      const totalBatches = Math.ceil(files.length / concurrency);

      console.log(`🔄 Batch ${batchNumber}/${totalBatches} (${batch.length} files)`);

      const batchPromises = batch.map(async (file) => {
        try {
          const result = await this.client.classify(file, templateId ? { templateId } : undefined);

          if (result.cacheInfo.cached) {
            cacheHits++;
          } else {
            cacheMisses++;
          }

          totalCost += result.performance.costUsd ?? 0;
          successCount++;

          console.log(
            `  ✅ ${file.split('/').pop()} - ${result.classification.domain} (${result.cacheInfo.cached ? 'cached' : '$' + result.performance.costUsd?.toFixed(6)})`
          );

          return {
            filePath: file,
            success: true,
            result,
          };
        } catch (error) {
          failureCount++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';

          console.log(`  ❌ ${file.split('/').pop()} - ${errorMsg}`);

          if (!continueOnError) {
            throw error;
          }

          return {
            filePath: file,
            success: false,
            error: errorMsg,
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Call incremental callback if provided
      if (onBatchComplete) {
        const successfulResults = batchResults
          .filter(
            (r): r is { filePath: string; success: true; result: ClassifyResult } =>
              r.success && 'result' in r
          )
          .map((r) => ({ filePath: r.filePath, result: r.result }));

        if (successfulResults.length > 0) {
          try {
            await onBatchComplete(successfulResults);
          } catch (error) {
            console.warn(
              `  ⚠️  Batch callback failed: ${error instanceof Error ? error.message : error}`
            );
          }
        }
      }

      console.log('');
    }

    const totalTimeMs = Date.now() - startTime;

    return {
      totalFiles: files.length,
      successCount,
      failureCount,
      skippedCount: 0,
      results,
      performance: {
        totalTimeMs,
        averageTimeMs: successCount > 0 ? totalTimeMs / successCount : 0,
        totalCost,
        averageCost: successCount > 0 ? totalCost / successCount : 0,
        cacheHits,
        cacheMisses,
      },
    };
  }

  /**
   * Process array of file paths with parallel batching
   * @param files - Array of file paths
   * @param options - Batch processing options
   * @returns Batch processing result
   */
  async processFiles(files: string[], options: BatchOptions = {}): Promise<BatchResult> {
    const { concurrency = 20, continueOnError = true, onBatchComplete, templateId } = options;

    const startTime = Date.now();

    console.log(`📁 Processing ${files.length} files`);
    console.log(`⚙️  Concurrency: ${concurrency} files per batch\n`);

    const results: Array<{
      filePath: string;
      success: boolean;
      result?: ClassifyResult;
      error?: string;
    }> = [];

    let successCount = 0;
    let failureCount = 0;
    let totalCost = 0;
    let cacheHits = 0;
    let cacheMisses = 0;

    // Process in parallel batches
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const batchNumber = Math.floor(i / concurrency) + 1;
      const totalBatches = Math.ceil(files.length / concurrency);
      const progress = (((i + batch.length) / files.length) * 100).toFixed(1);

      console.log(
        `📦 Batch ${batchNumber}/${totalBatches} | Progress: ${i + batch.length}/${files.length} (${progress}%)`
      );

      const batchPromises = batch.map(async (file) => {
        try {
          const result = await this.client.classify(file, templateId ? { templateId } : undefined);

          if (result.cacheInfo.cached) {
            cacheHits++;
          } else {
            cacheMisses++;
          }

          totalCost += result.performance.costUsd ?? 0;
          successCount++;

          return {
            filePath: file,
            success: true,
            result,
          };
        } catch (error) {
          failureCount++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';

          // Log first error for debugging
          if (failureCount === 1) {
            console.error(`\n❌ First error (${file}):\n  ${errorMsg}\n`);
          }

          if (!continueOnError) {
            throw error;
          }

          return {
            filePath: file,
            success: false,
            error: errorMsg,
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Show batch stats
      const batchSuccess = batchResults.filter((r) => r.success).length;
      const batchCached = batchResults.filter(
        (r) => r.success && 'result' in r && r.result?.cacheInfo.cached
      ).length;
      console.log(
        `   ✅ ${batchSuccess}/${batch.length} classified | 📦 ${batchCached} from cache`
      );

      // Call incremental callback if provided
      if (onBatchComplete) {
        const successfulResults = batchResults
          .filter(
            (r): r is { filePath: string; success: true; result: ClassifyResult } =>
              r.success && 'result' in r
          )
          .map((r) => ({ filePath: r.filePath, result: r.result }));

        if (successfulResults.length > 0) {
          try {
            await onBatchComplete(successfulResults);
            console.log(`   📤 Sent ${successfulResults.length} to databases`);
          } catch (error) {
            console.warn(
              `   ⚠️  Database insert failed: ${error instanceof Error ? error.message : error}`
            );
          }
        }
      }

      console.log('');
    }

    const totalTimeMs = Date.now() - startTime;

    return {
      totalFiles: files.length,
      successCount,
      failureCount,
      skippedCount: 0,
      results,
      performance: {
        totalTimeMs,
        averageTimeMs: successCount > 0 ? totalTimeMs / successCount : 0,
        totalCost,
        averageCost: successCount > 0 ? totalCost / successCount : 0,
        cacheHits,
        cacheMisses,
      },
    };
  }

  /**
   * Collect files from directory
   */
  private async collectFiles(
    directory: string,
    recursive: boolean,
    extensions?: string[]
  ): Promise<string[]> {
    const files: string[] = [];

    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(directory, entry.name);

      if (entry.isDirectory() && recursive) {
        const subFiles = await this.collectFiles(fullPath, recursive, extensions);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase().slice(1);

        if (!extensions || extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }
}
