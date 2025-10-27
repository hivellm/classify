#!/usr/bin/env tsx
/**
 * Classify All Code Samples
 * Classifies 20 code samples for Elasticsearch and Neo4j validation
 */

import { config } from 'dotenv';
config(); // Load .env

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

const SAMPLES_DIR = join(process.cwd(), 'samples', 'code');
const RESULTS_DIR = join(process.cwd(), 'samples', 'results');

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Classifying Code Samples for ES + Neo4j         ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Create results directory
  await mkdir(RESULTS_DIR, { recursive: true });

  // Initialize Classify client
  const client = new ClassifyClient({
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: true,
    compressionEnabled: true,
  });

  // Initialize database clients (optional)
  let neo4jClient: Neo4jClient | null = null;
  let elasticsearchClient: ElasticsearchClient | null = null;

  // Check if Neo4j is configured
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
      console.warn('   Continuing without Neo4j integration\n');
      neo4jClient = null;
    }
  } else {
    console.log('ℹ️  Neo4j not configured (set NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD)\n');
  }

  // Check if Elasticsearch is configured
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
        index: process.env.ELASTICSEARCH_INDEX || 'classify-documents',
      });
      await elasticsearchClient.initialize();
    } catch (error) {
      console.warn(`⚠️  Elasticsearch unavailable: ${error instanceof Error ? error.message : error}`);
      console.warn('   Continuing without Elasticsearch integration\n');
      elasticsearchClient = null;
    }
  } else {
    console.log('ℹ️  Elasticsearch not configured (set ELASTICSEARCH_URL)\n');
  }

  // Find all sample files
  const patterns = [
    'typescript/**/*.ts',
    'rust/**/*.rs',
    'python/**/*.py',
    'javascript/**/*.{js,jsx}',
    'docs/**/*.md',
    'config/**/*.{json,toml,yml,sh,py}',
  ];

  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(join(SAMPLES_DIR, pattern), {
      ignore: DEFAULT_IGNORE_PATTERNS as unknown as string[],
    });
    files.push(...matches);
  }

  console.log(`📁 Found ${files.length} files to classify\n`);

  type ResultWithFile = ClassifyResult & { file: string };
  const results: ResultWithFile[] = [];
  let successCount = 0;
  let failCount = 0;

  // Classify each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = file.replace(SAMPLES_DIR + '/', '');

    try {
      console.log(`[${i + 1}/${files.length}] Classifying: ${filename}`);

      const result = await client.classify(file, {
        templateId: 'software_project', // Force software template
      });

      console.log(
        `  ✅ ${result.classification.docType} - ${result.graphStructure.entities.length} entities, ${result.graphStructure.relationships.length} relationships`
      );
      console.log(`  💰 Cost: $${result.performance.costUsd?.toFixed(6) || 0} | ⏱️  ${result.performance.totalTimeMs}ms`);
      console.log(`  📦 Cache: ${result.cacheInfo.cached ? 'HIT' : 'MISS'}\n`);

      results.push({
        file: filename,
        ...result,
      });

      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
      failCount++;
    }
  }

  // Save individual results
  for (const result of results) {
    const filename = result.file.replace(/[\/\\]/g, '_').replace(/\.[^.]+$/, '');
    const outputPath = join(RESULTS_DIR, `${filename}.json`);
    await writeFile(outputPath, JSON.stringify(result, null, 2));
  }

  // Save summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    successCount,
    failCount,
    totalCost: results.reduce((sum, r) => sum + (r.performance.costUsd || 0), 0),
    totalTime: results.reduce((sum, r) => sum + r.performance.totalTimeMs, 0),
    cacheHits: results.filter((r) => r.cacheInfo.cached).length,
    cacheHitRate:
      results.filter((r) => r.cacheInfo.cached).length / results.length,
    totalEntities: results.reduce((sum, r) => sum + r.graphStructure.entities.length, 0),
    totalRelationships: results.reduce((sum, r) => sum + r.graphStructure.relationships.length, 0),
    files: results.map((r) => ({
      file: r.file,
      docType: r.classification.docType,
      entities: r.graphStructure.entities.length,
      relationships: r.graphStructure.relationships.length,
      cached: r.cacheInfo.cached,
    })),
  };

  await writeFile(join(RESULTS_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

  // Send to databases
  if (neo4jClient || elasticsearchClient) {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║  Sending to Databases                             ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    const batchData = results.map((r) => ({
      result: r,
      file: r.file,
    }));

    // Send to Neo4j
    if (neo4jClient) {
      try {
        console.log('🔵 Sending to Neo4j...');
        await neo4jClient.insertBatch(batchData);
        console.log(`   ✅ Inserted ${results.length} documents into Neo4j\n`);
      } catch (error) {
        console.error(`   ❌ Neo4j insert failed: ${error instanceof Error ? error.message : error}\n`);
      } finally {
        await neo4jClient.close();
      }
    }

    // Send to Elasticsearch
    if (elasticsearchClient) {
      try {
        console.log('🟢 Sending to Elasticsearch...');
        await elasticsearchClient.insertBatch(batchData);
        console.log(`   ✅ Indexed ${results.length} documents in Elasticsearch\n`);
      } catch (error) {
        console.error(`   ❌ Elasticsearch indexing failed: ${error instanceof Error ? error.message : error}\n`);
      } finally {
        await elasticsearchClient.close();
      }
    }
  }

  // Get cache stats
  const cacheStats = await client.getCacheStats();

  // Print summary
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║  Classification Complete!                         ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  console.log(`📊 Results:`);
  console.log(`   ✅ Success: ${successCount}/${files.length}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📦 Cache hits: ${summary.cacheHits}/${results.length} (${(summary.cacheHitRate * 100).toFixed(1)}%)`);
  console.log(`   🔢 Total entities: ${summary.totalEntities}`);
  console.log(`   🔗 Total relationships: ${summary.totalRelationships}`);
  console.log(`   💰 Total cost: $${summary.totalCost.toFixed(6)}`);
  console.log(`   ⏱️  Total time: ${(summary.totalTime / 1000).toFixed(1)}s`);
  console.log(`\n📁 Results saved to: ${RESULTS_DIR}/`);
  console.log(`\n📈 Cache Stats:`);
  console.log(`   Entries: ${cacheStats.entryCount}`);
  console.log(`   Size: ${(cacheStats.totalSizeBytes / 1024).toFixed(1)}KB`);
  console.log(`   Hit rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
  
  if (neo4jClient || elasticsearchClient) {
    console.log(`\n✅ Data sent to:`);
    if (neo4jClient) console.log(`   🔵 Neo4j: ${results.length} documents`);
    if (elasticsearchClient) console.log(`   🟢 Elasticsearch: ${results.length} documents`);
  }
}

main().catch(console.error);

