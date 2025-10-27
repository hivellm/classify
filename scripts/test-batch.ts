/**
 * Test script for batch processing with cache
 */
import { ClassifyClient } from '../src/client.js';
import { BatchProcessor } from '../src/batch/batch-processor.js';
import 'dotenv/config';

async function main() {
  console.log('🚀 Testing Batch Processing with Cache\n');

  // Initialize client
  const client = new ClassifyClient({
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: true,
    cacheDir: '.classify-cache',
    compressionEnabled: true,
  });

  // Create batch processor
  const batchProcessor = new BatchProcessor(client);

  console.log('📦 Processing test-documents/ directory\n');
  console.log('Expected behavior:');
  console.log('  - First run: All 10 documents classified (COLD)');
  console.log('  - If run again: All from cache (WARM)\n');
  console.log('═'.repeat(70));
  console.log('');

  // Process directory
  const result = await batchProcessor.processDirectory('./test-documents', {
    recursive: false,
    concurrency: 3, // Process 3 at a time
    extensions: ['md'],
    continueOnError: true,
  });

  // Summary
  console.log('\n📊 BATCH PROCESSING SUMMARY\n');
  console.log('═'.repeat(70));
  console.log(`Total Files: ${result.totalFiles}`);
  console.log(`✅ Success: ${result.successCount}`);
  console.log(`❌ Failures: ${result.failureCount}`);
  console.log(`⏭️  Skipped: ${result.skippedCount}`);
  console.log('─'.repeat(70));
  console.log(`⏱️  Total Time: ${(result.performance.totalTimeMs / 1000).toFixed(2)}s`);
  console.log(`📊 Average Time: ${(result.performance.averageTimeMs / 1000).toFixed(2)}s per document`);
  console.log(`💰 Total Cost: $${result.performance.totalCost.toFixed(6)}`);
  console.log(`💵 Average Cost: $${result.performance.averageCost.toFixed(6)} per document`);
  console.log('─'.repeat(70));
  console.log(`🎯 Cache Hits: ${result.performance.cacheHits}`);
  console.log(`❄️  Cache Misses: ${result.performance.cacheMisses}`);
  console.log(
    `📈 Cache Hit Rate: ${((result.performance.cacheHits / result.totalFiles) * 100).toFixed(1)}%`
  );
  console.log('═'.repeat(70));

  // Cache stats
  const cacheStats = await client.getCacheStats();
  console.log('\n💾 Cache Statistics\n');
  console.log(`Entries: ${cacheStats.entryCount}`);
  console.log(`Size: ${(cacheStats.totalSizeBytes / 1024).toFixed(2)} KB`);
  console.log(`Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
  console.log(`Cost Saved: $${cacheStats.costSaved.toFixed(6)}`);

  console.log('\n✨ Batch test complete!');
  console.log('\n💡 Try running this script again to see 100% cache hits!');
}

main().catch(console.error);

