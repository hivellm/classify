/**
 * Test script to demonstrate cache functionality
 */
import { ClassifyClient } from '../src/client.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

async function main() {
  console.log('🧪 Testing Cache Functionality\n');

  // Create test document
  const testDir = join(process.cwd(), 'tests', 'test-documents');
  await mkdir(testDir, { recursive: true });

  const testFile = join(testDir, 'cache-test-contract.md');
  const content = `# Software License Agreement

This agreement is entered into on January 1, 2025, between SoftCo Inc. ("Licensor") and UserCorp Ltd. ("Licensee").

## 1. Grant of License
Licensor grants Licensee a non-exclusive license to use the Software.

## 2. Term
This license is valid for one (1) year from the effective date.

## 3. Payment
Licensee shall pay $10,000 annually.`;

  await writeFile(testFile, content);

  // Initialize client with cache enabled
  const client = new ClassifyClient({
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: true,
    cacheDir: '.test-cache',
    compressionEnabled: true,
  });

  console.log('📊 First Classification (COLD - No Cache)\n');
  console.log('  Classifying document...');
  const startCold = Date.now();
  const result1 = await client.classify(testFile);
  const coldTime = Date.now() - startCold;

  console.log(`  ✅ Classified: ${result1.classification.domain}`);
  console.log(`  💰 Cost: $${result1.performance.costUsd?.toFixed(6)}`);
  console.log(`  ⏱️  Time: ${coldTime}ms`);
  console.log(`  🔢 Tokens: ${result1.performance.tokens?.total}`);
  console.log(`  💾 Cached: ${result1.cacheInfo.cached ? 'YES' : 'NO'}`);
  console.log(`  🔑 Hash: ${result1.cacheInfo.hash.slice(0, 16)}...`);

  console.log('\n📊 Second Classification (WARM - From Cache)\n');
  console.log('  Retrieving from cache...');
  const startWarm = Date.now();
  const result2 = await client.classify(testFile);
  const warmTime = Date.now() - startWarm;

  console.log(`  ✅ Classified: ${result2.classification.domain}`);
  console.log(`  💰 Cost: $${result2.performance.costUsd?.toFixed(6)} (saved from cache)`);
  console.log(`  ⏱️  Time: ${warmTime}ms`);
  console.log(`  🔢 Tokens: ${result2.performance.tokens?.total} (saved)`);
  console.log(`  💾 Cached: ${result2.cacheInfo.cached ? 'YES ✨' : 'NO'}`);
  console.log(`  🔑 Hash: ${result2.cacheInfo.hash.slice(0, 16)}...`);

  console.log('\n📈 Cache Performance Comparison\n');
  console.log('═'.repeat(60));
  console.log(`Cold Start Time: ${coldTime}ms`);
  console.log(`Warm Cache Time: ${warmTime}ms`);
  console.log(`Speed Improvement: ${((coldTime / warmTime) * 100).toFixed(0)}% faster`);
  console.log(`Time Saved: ${coldTime - warmTime}ms`);
  console.log('═'.repeat(60));

  // Cache stats
  const stats = await client.getCacheStats();
  console.log('\n📊 Cache Statistics\n');
  console.log(`Total Entries: ${stats.entryCount}`);
  console.log(`Cache Size: ${(stats.totalSizeBytes / 1024).toFixed(2)} KB`);
  console.log(`Hit Rate: ${(stats.hitRate * 100).toFixed(1)}%`);
  console.log(`Hits: ${stats.hits}`);
  console.log(`Misses: ${stats.misses}`);
  console.log(`Cost Saved: $${stats.costSaved.toFixed(6)}`);

  console.log('\n✨ Cache test complete!');
  console.log(`\n💡 Cache location: ${join(process.cwd(), '.test-cache')}`);
}

main().catch(console.error);

