import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BatchProcessor } from '../../src/batch/batch-processor.js';
import { ClassifyClient } from '../../src/client.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';

describe('BatchProcessor', () => {
  const testDir = join(process.cwd(), 'tests', 'temp-batch');
  let client: ClassifyClient;
  let processor: BatchProcessor;

  beforeEach(async () => {
    client = new ClassifyClient({
      apiKey: 'test-key',
      cacheEnabled: false,
    });
    processor = new BatchProcessor(client);

    // Create test directory and files
    await mkdir(testDir, { recursive: true });
    await writeFile(join(testDir, 'test1.txt'), 'Test content 1');
    await writeFile(join(testDir, 'test2.txt'), 'Test content 2');
    await writeFile(join(testDir, 'test3.html'), '<html><body>Test</body></html>');
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('processDirectory', () => {
    it.skip('should collect files from directory (requires API key)', async () => {
      // Requires real API key - skip in CI
      await processor.processDirectory(testDir, {
        concurrency: 1,
        continueOnError: true,
      });
    });

    it('should validate batch processor instantiation', () => {
      expect(processor).toBeDefined();
      expect(processor).toBeInstanceOf(BatchProcessor);
    });
  });
});
