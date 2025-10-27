#!/usr/bin/env tsx
/**
 * Quick Test - Classify just 100 files from Vectorizer
 * For rapid testing before full run
 */

import { config } from 'dotenv';
config();

import {
  ClassifyClient,
  DEFAULT_IGNORE_PATTERNS,
  Neo4jClient,
  ElasticsearchClient,
  type ClassifyResult,
} from '../../src/index.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

const VECTORIZER_DIR = join(process.cwd(), '..', 'vectorizer');
const RESULTS_DIR = join(process.cwd(), 'samples', 'vectorizer-test-results');
const MAX_FILES = 100; // Quick test with 100 files
const BATCH_SIZE = 20;

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Quick Test - 100 Vectorizer Files                ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  await mkdir(RESULTS_DIR, { recursive: true });

  const client = new ClassifyClient({
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: true,
    compressionEnabled: true,
  });

  // Initialize databases
  let neo4jClient: Neo4jClient | null = null;
  let elasticsearchClient: ElasticsearchClient | null = null;

  if (process.env.NEO4J_URL && process.env.NEO4J_USERNAME && process.env.NEO4J_PASSWORD) {
    console.log('🔵 Initializing Neo4j...');
    neo4jClient = new Neo4jClient({
      url: process.env.NEO4J_URL,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
      database: process.env.NEO4J_DATABASE || 'neo4j',
    });
    await neo4jClient.initialize();
  }

  if (process.env.ELASTICSEARCH_URL) {
    console.log('🟢 Initializing Elasticsearch...');
    elasticsearchClient = new ElasticsearchClient({
      url: process.env.ELASTICSEARCH_URL,
      auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
        ? { username: process.env.ELASTICSEARCH_USERNAME, password: process.env.ELASTICSEARCH_PASSWORD }
        : undefined,
      index: 'vectorizer-test',
    });
    await elasticsearchClient.initialize();
  }

  // Find files
  console.log('\n🔍 Scanning for Rust files...');
  const allFiles = await glob(join(VECTORIZER_DIR, '**/*.rs'), {
    ignore: [
      ...DEFAULT_IGNORE_PATTERNS as unknown as string[],
      '**/qdrant/**',
      '**/sample/**',
      '**/samples/**',
    ],
  });

  const files = allFiles.slice(0, MAX_FILES);
  console.log(`📁 Selected ${files.length} files for quick test\n`);

  type ResultWithFile = ClassifyResult & { file: string };
  const results: ResultWithFile[] = [];
  let successCount = 0;
  let failCount = 0;

  const startTime = Date.now();

  // Process in batches
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, Math.min(i + BATCH_SIZE, files.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);

    console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} files)`);

    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const relativePath = file.replace(VECTORIZER_DIR + '/', '');
        try {
          const result = await client.classify(file, { templateId: 'software_project' });
          return { success: true, data: { file: relativePath, ...result } };
        } catch (error) {
          console.error(`   ❌ ${relativePath.substring(0, 50)}`);
          return { success: false };
        }
      })
    );

    batchResults.forEach((r) => {
      if (r.success && 'data' in r) {
        results.push(r.data);
        successCount++;
      } else {
        failCount++;
      }
    });

    const cached = batchResults.filter(r => r.success && 'data' in r && r.data.cacheInfo.cached).length;
    console.log(`   ✅ ${batchResults.filter(r => r.success).length}/${batch.length} | 📦 ${cached} cached\n`);
  }

  const totalTime = Date.now() - startTime;

  // Send to databases
  if (neo4jClient || elasticsearchClient) {
    console.log('📤 Sending to databases...\n');
    const batchData = results.map(r => ({ result: r, file: r.file }));

    if (neo4jClient) {
      await neo4jClient.insertBatch(batchData);
      console.log('   🔵 Neo4j: done');
      await neo4jClient.close();
    }

    if (elasticsearchClient) {
      await elasticsearchClient.insertBatch(batchData);
      console.log('   🟢 Elasticsearch: done\n');
      await elasticsearchClient.close();
    }
  }

  // Summary
  const summary = {
    totalFiles: files.length,
    successCount,
    failCount,
    totalTime,
    totalEntities: results.reduce((sum, r) => sum + r.graphStructure.entities.length, 0),
    totalRelationships: results.reduce((sum, r) => sum + r.graphStructure.relationships.length, 0),
    cacheHits: results.filter(r => r.cacheInfo.cached).length,
  };

  await writeFile(join(RESULTS_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Quick Test Complete!                             ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  console.log(`✅ Success: ${successCount}/${files.length}`);
  console.log(`📦 Cache: ${summary.cacheHits}/${results.length} hits`);
  console.log(`🔢 Entities: ${summary.totalEntities}`);
  console.log(`🔗 Relationships: ${summary.totalRelationships}`);
  console.log(`⏱️  Time: ${(totalTime / 1000).toFixed(1)}s\n`);
}

main().catch(console.error);

