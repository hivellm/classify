/**
 * Batch process 100 Vectorizer files with cursor-agent
 * Index results in both Elasticsearch and Neo4j
 */

import { ClassifyClient } from '../../src/client.js';
import { BatchProcessor } from '../../src/batch/batch-processor.js';
import { ElasticsearchClient } from '../../src/integrations/elasticsearch-client.js';
import { Neo4jClient } from '../../src/integrations/neo4j-client.js';
import { glob } from 'glob';
import * as path from 'path';

async function main() {
  console.log('🚀 Batch Processing Vectorizer with cursor-agent\n');

  // Initialize clients
  const client = new ClassifyClient({
    provider: 'cursor-agent',
    cacheEnabled: true,
    compressionEnabled: true,
  });

  const elasticsearch = new ElasticsearchClient({
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    index: 'vectorizer-docs',
  });

  const neo4j = new Neo4jClient({
    url: process.env.NEO4J_URL || 'http://localhost:7474',
    username: process.env.NEO4J_USERNAME || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password',
  });

  // Initialize databases
  console.log('📡 Connecting to databases...');
  try {
    await elasticsearch.initialize();
    console.log('✅ Elasticsearch connected');
  } catch (error) {
    console.warn('⚠️  Elasticsearch not available:', error instanceof Error ? error.message : error);
  }

  try {
    await neo4j.initialize();
    console.log('✅ Neo4j connected');
  } catch (error) {
    console.warn('⚠️  Neo4j not available:', error instanceof Error ? error.message : error);
  }

  // Find Rust files in vectorizer project
  const vectorizerPath = path.join(process.cwd(), '..', 'vectorizer');
  console.log(`\n📂 Scanning: ${vectorizerPath}`);

  const files = await glob('**/*.rs', {
    cwd: vectorizerPath,
    ignore: ['target/**', 'tests/**', 'benches/**'],
    absolute: true,
  });

  // Limit to 100 files
  const filesToProcess = files.slice(0, 100);
  console.log(`📊 Found ${files.length} Rust files, processing first ${filesToProcess.length}\n`);

  // Create batch processor
  const batchProcessor = new BatchProcessor(client);

  let processedCount = 0;
  let indexedElastic = 0;
  let indexedNeo4j = 0;
  let errors = 0;

  // Process files with callback for incremental indexing
  const startTime = Date.now();

  const batchResult = await batchProcessor.processFiles(filesToProcess, {
    concurrency: 3, // Process 3 at a time
    templateId: 'software_project',
    compressionEnabled: true,
    onProgress: (current, total, file) => {
      console.log(`\n[${current}/${total}] Processing: ${path.basename(file)}`);
    },
    onBatchComplete: async (batchResults) => {
      // Index each result immediately
      for (const item of batchResults) {
        const fileName = path.basename(item.filePath);

        // Index in Elasticsearch
        try {
          await elasticsearch.insertResult(item.result, item.filePath);
          indexedElastic++;
        } catch (error) {
          console.warn(`  ⚠️  Elasticsearch ${fileName}:`, error instanceof Error ? error.message : error);
        }

        // Index in Neo4j
        try {
          await neo4j.insertResult(item.result, item.filePath);
          indexedNeo4j++;
        } catch (error) {
          console.warn(`  ⚠️  Neo4j ${fileName}:`, error instanceof Error ? error.message : error);
        }

        processedCount++;
      }
    },
  });

  const duration = Date.now() - startTime;

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${(duration / 1000).toFixed(1)}s (${(duration / 60000).toFixed(1)} min)`);
  console.log(`📄 Files processed: ${batchResult.successCount}/${batchResult.totalFiles}`);
  console.log(`❌ Errors: ${batchResult.failureCount}`);
  console.log(`💾 Cache: ${batchResult.performance.cacheHits} hits / ${batchResult.performance.cacheMisses} misses`);
  console.log(`\n💰 Costs:`);
  console.log(`   - Total: $${batchResult.performance.totalCost.toFixed(4)}`);
  console.log(`   - Average per file: $${batchResult.performance.averageCost.toFixed(6)}`);
  console.log(`\n🔍 Indexing:`);
  console.log(`   - Elasticsearch: ${indexedElastic} documents`);
  console.log(`   - Neo4j: ${indexedNeo4j} documents`);

  // Close connections
  await elasticsearch.close();
  await neo4j.close();

  console.log('\n✅ All done!\n');
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

