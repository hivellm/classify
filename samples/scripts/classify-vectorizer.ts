#!/usr/bin/env tsx
/**
 * Classify Complete Vectorizer Project
 * Maps entire vectorizer codebase to Neo4j and Elasticsearch
 */

import { config } from 'dotenv';
config();

import {
  ClassifyClient,
  BatchProcessor,
  DEFAULT_IGNORE_PATTERNS,
  Neo4jClient,
  ElasticsearchClient,
  type ClassifyResult,
} from '../../src/index.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

const VECTORIZER_DIR = join(process.cwd(), '..', 'vectorizer');
const RESULTS_DIR = join(process.cwd(), 'samples', 'vectorizer-results');

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Classifying Vectorizer Project                   ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Create results directory
  await mkdir(RESULTS_DIR, { recursive: true });

  // Initialize Classify client
  const client = new ClassifyClient({
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: true,
    compressionEnabled: true,
  });

  // Initialize database clients
  let neo4jClient: Neo4jClient | null = null;
  let elasticsearchClient: ElasticsearchClient | null = null;

  // Neo4j setup
  if (process.env.NEO4J_URL && process.env.NEO4J_USERNAME && process.env.NEO4J_PASSWORD) {
    console.log('🔵 Initializing Neo4j client...');
    try {
      neo4jClient = new Neo4jClient({
        url: process.env.NEO4J_URL,
        username: process.env.NEO4J_USERNAME,
        password: process.env.NEO4J_PASSWORD,
        database: process.env.NEO4J_DATABASE || 'neo4j',
      });
      await neo4jClient.initialize();
    } catch (error) {
      console.warn(`⚠️  Neo4j unavailable: ${error instanceof Error ? error.message : error}`);
      neo4jClient = null;
    }
  }

  // Elasticsearch setup
  if (process.env.ELASTICSEARCH_URL) {
    console.log('🟢 Initializing Elasticsearch client...');
    try {
      elasticsearchClient = new ElasticsearchClient({
        url: process.env.ELASTICSEARCH_URL,
        auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
          ? {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD,
            }
          : undefined,
        apiKey: process.env.ELASTICSEARCH_API_KEY,
        index: 'vectorizer-codebase',
      });
      await elasticsearchClient.initialize();
    } catch (error) {
      console.warn(`⚠️  Elasticsearch unavailable: ${error instanceof Error ? error.message : error}`);
      elasticsearchClient = null;
    }
  }

  console.log('');

  // Find all relevant files in vectorizer project
  const patterns = [
    '**/*.rs',           // Rust source
    '**/*.toml',         // Cargo configs
    '**/*.md',           // Documentation
    '**/*.json',         // Config files
    '**/*.yml',          // YAML configs
    '**/*.yaml',         // YAML configs
    '**/*.sh',           // Shell scripts
  ];

  console.log('🔍 Scanning vectorizer directory...\n');
  
  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(join(VECTORIZER_DIR, pattern), {
      ignore: [
        ...DEFAULT_IGNORE_PATTERNS as unknown as string[],
        '**/examples/**',         // Skip example outputs
        '**/tests/fixtures/**',   // Skip test fixtures
        '**/qdrant/**',           // Skip qdrant directory (1.3k files)
        '**/sample/**',           // Skip sample directory (59k files!)
        '**/samples/**',          // Skip samples directory
        '**/client-sdks/**',      // Skip generated SDKs (48k files!)
        '**/gui/**',              // Skip GUI (20k files)
        '**/data/**',             // Skip data files
        '**/models/**',           // Skip model binaries
        '**/logs/**',             // Skip logs
        '**/assets/**',           // Skip assets
        '**/dashboard/**',        // Skip dashboard
      ],
    });
    files.push(...matches);
  }

  console.log(`📁 Found ${files.length} files to classify\n`);

  if (files.length === 0) {
    console.error('❌ No files found. Check if vectorizer directory exists at:', VECTORIZER_DIR);
    return;
  }

  // Create BatchProcessor
  const batchProcessor = new BatchProcessor(client);

  // Incremental database indexing callback
  const onBatchComplete = async (batchResults: Array<{ filePath: string; result: ClassifyResult }>) => {
    const batchData = batchResults.map(({ filePath, result }) => ({
      result,
      file: filePath.replace(VECTORIZER_DIR + '/', ''),
    }));

    // Send to Neo4j incrementally
    if (neo4jClient) {
      try {
        await neo4jClient.insertBatch(batchData);
      } catch (error) {
        console.warn(`   🔵 Neo4j: ${error instanceof Error ? error.message : error}`);
      }
    }

    // Send to Elasticsearch incrementally
    if (elasticsearchClient) {
      try {
        await elasticsearchClient.insertBatch(batchData);
      } catch (error) {
        console.warn(`   🟢 ES: ${error instanceof Error ? error.message : error}`);
      }
    }
  };

  // Process all files with parallel batching and incremental indexing
  const result = await batchProcessor.processFiles(files, {
    concurrency: 20,
    continueOnError: true,
    templateId: 'software_project',
    onBatchComplete: (neo4jClient || elasticsearchClient) ? onBatchComplete : undefined,
  });

  const { successCount, failureCount, performance, results: processResults } = result;

  // Close database connections
  if (neo4jClient) await neo4jClient.close();
  if (elasticsearchClient) await elasticsearchClient.close();

  // Calculate aggregations
  console.log('💾 Calculating summary...');
  
  const byFileType: Record<string, number> = {};
  const byDocType: Record<string, number> = {};
  let totalEntities = 0;
  let totalRelationships = 0;

  processResults.forEach((r) => {
    if (r.success && r.result) {
      const ext = r.filePath.split('.').pop() || 'unknown';
      byFileType[ext] = (byFileType[ext] || 0) + 1;
      byDocType[r.result.classification.docType] = (byDocType[r.result.classification.docType] || 0) + 1;
      totalEntities += r.result.graphStructure.entities.length;
      totalRelationships += r.result.graphStructure.relationships.length;
    }
  });

  const summary = {
    timestamp: new Date().toISOString(),
    project: 'vectorizer',
    totalFiles: files.length,
    successCount,
    failureCount,
    totalCost: performance.totalCost,
    totalTime: performance.totalTimeMs,
    cacheHits: performance.cacheHits,
    cacheHitRate: performance.cacheHits / successCount,
    totalEntities,
    totalRelationships,
    byFileType,
    byDocType,
  };

  await writeFile(join(RESULTS_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

  // Get cache stats
  const cacheStats = await client.getCacheStats();

  // Print comprehensive summary
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Vectorizer Classification Complete!              ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  console.log('📊 Classification Results:');
  console.log(`   ✅ Success: ${successCount}/${files.length} (${((successCount/files.length)*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log(`   📦 Cache hits: ${performance.cacheHits}/${successCount} (${((performance.cacheHits/successCount)*100).toFixed(1)}%)`);
  console.log(`   💰 Total cost: $${performance.totalCost.toFixed(6)}`);
  console.log(`   ⏱️  Total time: ${(performance.totalTimeMs / 1000 / 60).toFixed(1)} minutes`);
  
  console.log('\n🔢 Entity & Relationship Stats:');
  console.log(`   Total entities: ${summary.totalEntities}`);
  console.log(`   Total relationships: ${summary.totalRelationships}`);
  console.log(`   Avg entities/file: ${(summary.totalEntities / successCount).toFixed(1)}`);
  
  console.log('\n📁 Files by Type:');
  Object.entries(summary.byFileType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      console.log(`   .${ext}: ${count} files`);
    });
  
  console.log('\n📋 Top Document Types:');
  Object.entries(summary.byDocType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count} docs`);
    });

  console.log('\n📈 Cache Stats:');
  console.log(`   Entries: ${cacheStats.entryCount}`);
  console.log(`   Size: ${(cacheStats.totalSizeBytes / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Hit rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
  
  if (neo4jClient || elasticsearchClient) {
    console.log('\n✅ Data sent incrementally during processing:');
    if (neo4jClient) console.log(`   🔵 Neo4j: ${successCount} documents`);
    if (elasticsearchClient) console.log(`   🟢 Elasticsearch: ${successCount} documents`);
  }

  console.log(`\n💾 Summary saved to: ${RESULTS_DIR}/summary.json`);
  console.log('🎯 Next: Run validate-test.ts to verify the results!');
}

main().catch(console.error);

