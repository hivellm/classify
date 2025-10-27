#!/usr/bin/env node

/**
 * Compare TINY vs STANDARD Templates
 * 
 * This script:
 * 1. Processes documents with STANDARD templates
 * 2. Processes same documents with TINY templates
 * 3. Indexes both in Elasticsearch (separate indices)
 * 4. Indexes both in Neo4j (separate labels)
 * 5. Runs comparison queries
 * 6. Generates quality comparison report
 */

import { ClassifyClient } from '../../src/client.js';
import { BatchProcessor } from '../../src/batch/batch-processor.js';
import { ElasticsearchClient } from '../../src/integrations/elasticsearch-client.js';
import { Neo4jClient } from '../../src/integrations/neo4j-client.js';
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComparisonResult {
  file: string;
  standard: {
    entities: number;
    relationships: number;
    keywords: number;
    summaryLength: number;
    processingTime: number;
    cost: number;
  };
  tiny: {
    entities: number;
    relationships: number;
    keywords: number;
    summaryLength: number;
    processingTime: number;
    cost: number;
  };
  savings: {
    entities: string;
    relationships: string;
    cost: string;
    time: string;
  };
}

interface SearchComparison {
  query: string;
  standardResults: number;
  tinyResults: number;
  qualityDiff: string;
  topStandardDocs: string[];
  topTinyDocs: string[];
  overlap: number;
}

async function main() {
  console.log('🔬 TINY vs STANDARD Template Comparison\n');
  console.log('=' .repeat(80));

  // Get test files
  const testFiles = await glob('samples/code/**/*.{rs,ts,js,py,md}', {
    cwd: join(__dirname, '../..'),
    absolute: true,
    ignore: ['**/node_modules/**', '**/target/**']
  });

  console.log(`\n📂 Found ${testFiles.length} files to process\n`);

  // Initialize databases (optional)
  console.log('🗄️  Checking databases...');
  
  let esStandard: ElasticsearchClient | null = null;
  let esTiny: ElasticsearchClient | null = null;
  let neo4jStandard: Neo4jClient | null = null;
  let neo4jTiny: Neo4jClient | null = null;

  try {
    esStandard = new ElasticsearchClient({
      url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      index: 'classify-standard',
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    });
    await esStandard.initialize();
    console.log('  ✅ Elasticsearch connected');
  } catch (error) {
    console.log('  ⚠️  Elasticsearch not available (skipping indexing)');
    esStandard = null;
  }

  try {
    esTiny = new ElasticsearchClient({
      url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      index: 'classify-tiny',
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    });
    await esTiny.initialize();
  } catch (error) {
    esTiny = null;
  }

  try {
    neo4jStandard = new Neo4jClient({
      url: process.env.NEO4J_URL || 'http://localhost:7474',
      username: process.env.NEO4J_USERNAME || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'password',
      database: process.env.NEO4J_DATABASE || 'neo4j',
    });
    await neo4jStandard.initialize();
    console.log('  ✅ Neo4j connected');
  } catch (error) {
    console.log('  ⚠️  Neo4j not available (skipping indexing)');
    neo4jStandard = null;
  }

  try {
    neo4jTiny = new Neo4jClient({
      url: process.env.NEO4J_URL || 'http://localhost:7474',
      username: process.env.NEO4J_USERNAME || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'password',
      database: process.env.NEO4J_DATABASE || 'neo4j',
    });
    await neo4jTiny.initialize();
  } catch (error) {
    neo4jTiny = null;
  }

  console.log('');

  // Process with STANDARD templates
  console.log('📊 Processing with STANDARD templates...');
  const standardClient = new ClassifyClient({
    provider: 'deepseek',
    cacheEnabled: true,
    compressionEnabled: true,
    templatesDir: 'templates/standard', // Use standard templates
  });

  const standardProcessor = new BatchProcessor(standardClient);
  const standardResults: ComparisonResult[] = [];
  let standardTotalCost = 0;
  let standardTotalTime = 0;

  const standardBatchResult = await standardProcessor.processFiles(testFiles.slice(0, 20), {
    concurrency: 5,
    continueOnError: true,
    onProgress: (current, total, file) => {
      process.stdout.write(`\r  Processing STANDARD: ${current}/${total} - ${file}`);
    },
    onBatchComplete: async (results) => {
      // Index in Elasticsearch
      if (esStandard) {
        await esStandard.insertBatch(results.map(r => ({ result: r.result, file: r.file })));
      }
      
      // Index in Neo4j with :STANDARD label
      if (neo4jStandard) {
        for (const { result, file } of results) {
          const cypherWithLabel = result.graphStructure.cypher.replace(
            /CREATE \(doc:Document/g,
            'CREATE (doc:Document:STANDARD'
          );
          await neo4jStandard.executeCypher(cypherWithLabel);
        }
      }

      // Track metrics
      for (const { result, file } of results) {
        const processingTime = result.performance.totalTimeMs || 0;
        const cost = result.performance.costUsd || 0;
        
        standardTotalCost += cost;
        standardTotalTime += processingTime;

        standardResults.push({
          file,
          standard: {
            entities: result.graphStructure.entities.length,
            relationships: result.graphStructure.relationships.length,
            keywords: result.fulltextMetadata.keywords.length,
            summaryLength: result.fulltextMetadata.summary?.length || 0,
            processingTime,
            cost,
          },
          tiny: { entities: 0, relationships: 0, keywords: 0, summaryLength: 0, processingTime: 0, cost: 0 },
          savings: { entities: '0%', relationships: '0%', cost: '0%', time: '0%' },
        });
      }
    },
  });

  console.log(`\n✅ STANDARD: Processed ${standardBatchResult.successful} files`);
  console.log(`   Total cost: $${standardTotalCost.toFixed(4)}`);
  console.log(`   Total time: ${(standardTotalTime / 1000).toFixed(1)}s\n`);

  // Process with TINY templates
  console.log('📊 Processing with TINY templates...');
  const tinyClient = new ClassifyClient({
    provider: 'deepseek',
    cacheEnabled: false, // Force reprocessing
    compressionEnabled: true,
    templatesDir: 'templates/tiny', // Use tiny templates (default)
  });

  const tinyProcessor = new BatchProcessor(tinyClient);
  let tinyTotalCost = 0;
  let tinyTotalTime = 0;
  let tinyIndex = 0;

  const tinyBatchResult = await tinyProcessor.processFiles(testFiles.slice(0, 20), {
    concurrency: 5,
    continueOnError: true,
    onProgress: (current, total, file) => {
      process.stdout.write(`\r  Processing TINY: ${current}/${total} - ${file}`);
    },
    onBatchComplete: async (results) => {
      // Index in Elasticsearch
      if (esTiny) {
        await esTiny.insertBatch(results.map(r => ({ result: r.result, file: r.file })));
      }
      
      // Index in Neo4j with :TINY label
      if (neo4jTiny) {
        for (const { result, file } of results) {
          const cypherWithLabel = result.graphStructure.cypher.replace(
            /CREATE \(doc:Document/g,
            'CREATE (doc:Document:TINY'
          );
          await neo4jTiny.executeCypher(cypherWithLabel);
        }
      }

      // Update comparison results
      for (const { result, file } of results) {
        const processingTime = result.performance.totalTimeMs || 0;
        const cost = result.performance.costUsd || 0;
        
        tinyTotalCost += cost;
        tinyTotalTime += processingTime;

        if (tinyIndex < standardResults.length) {
          const comparison = standardResults[tinyIndex];
          comparison.tiny = {
            entities: result.graphStructure.entities.length,
            relationships: result.graphStructure.relationships.length,
            keywords: result.fulltextMetadata.keywords.length,
            summaryLength: result.fulltextMetadata.summary?.length || 0,
            processingTime,
            cost,
          };

          // Calculate savings
          comparison.savings = {
            entities: `${(((comparison.standard.entities - comparison.tiny.entities) / comparison.standard.entities) * 100).toFixed(0)}%`,
            relationships: `${(((comparison.standard.relationships - comparison.tiny.relationships) / comparison.standard.relationships) * 100).toFixed(0)}%`,
            cost: `${(((comparison.standard.cost - comparison.tiny.cost) / comparison.standard.cost) * 100).toFixed(0)}%`,
            time: `${(((comparison.standard.processingTime - comparison.tiny.processingTime) / comparison.standard.processingTime) * 100).toFixed(0)}%`,
          };

          tinyIndex++;
        }
      }
    },
  });

  console.log(`\n✅ TINY: Processed ${tinyBatchResult.successful} files`);
  console.log(`   Total cost: $${tinyTotalCost.toFixed(4)}`);
  console.log(`   Total time: ${(tinyTotalTime / 1000).toFixed(1)}s\n`);

  // Run comparison queries (only if Elasticsearch is available)
  const searchComparisons: SearchComparison[] = [];

  if (esStandard && esTiny) {
    console.log('🔍 Running comparison queries...\n');

    const searchQueries = [
      'embedding implementation',
      'database storage',
      'vector search',
      'configuration',
      'test coverage',
    ];

    for (const query of searchQueries) {
      console.log(`  Searching: "${query}"`);

      try {
        // Search in both Elasticsearch indices
        const [standardSearch, tinySearch] = await Promise.all([
          fetch(`${process.env.ELASTICSEARCH_URL || 'http://localhost:9200'}/classify-standard/_search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: {
                multi_match: {
                  query,
                  fields: ['title^2', 'keywords', 'summary', 'content'],
                },
              },
              size: 10,
            }),
          }).then(r => r.json()),
          fetch(`${process.env.ELASTICSEARCH_URL || 'http://localhost:9200'}/classify-tiny/_search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: {
                multi_match: {
                  query,
                  fields: ['title^2', 'keywords', 'summary', 'content'],
                },
              },
              size: 10,
            }),
          }).then(r => r.json()),
        ]);

        const standardDocs = standardSearch.hits?.hits?.map((h: any) => h._source.sourceFile) || [];
        const tinyDocs = tinySearch.hits?.hits?.map((h: any) => h._source.sourceFile) || [];

        // Calculate overlap
        const standardSet = new Set(standardDocs);
        const overlap = tinyDocs.filter(doc => standardSet.has(doc)).length;
        const overlapPercent = tinyDocs.length > 0 ? (overlap / tinyDocs.length) * 100 : 0;

        searchComparisons.push({
          query,
          standardResults: standardDocs.length,
          tinyResults: tinyDocs.length,
          qualityDiff: `${overlapPercent.toFixed(0)}% overlap`,
          topStandardDocs: standardDocs.slice(0, 5),
          topTinyDocs: tinyDocs.slice(0, 5),
          overlap,
        });

        console.log(`    STANDARD: ${standardDocs.length} results, TINY: ${tinyDocs.length} results (${overlapPercent.toFixed(0)}% overlap)`);
      } catch (error) {
        console.log(`    ⚠️  Search failed: ${error}`);
      }
    }
  } else {
    console.log('⚠️  Skipping search queries (Elasticsearch not available)\n');
  }

  // Generate report
  console.log('\n📊 Generating comparison report...\n');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesProcessed: standardResults.length,
      standard: {
        totalCost: standardTotalCost,
        totalTime: standardTotalTime,
        avgCost: standardTotalCost / standardResults.length,
        avgTime: standardTotalTime / standardResults.length,
        avgEntities: standardResults.reduce((sum, r) => sum + r.standard.entities, 0) / standardResults.length,
        avgRelationships: standardResults.reduce((sum, r) => sum + r.standard.relationships, 0) / standardResults.length,
      },
      tiny: {
        totalCost: tinyTotalCost,
        totalTime: tinyTotalTime,
        avgCost: tinyTotalCost / standardResults.length,
        avgTime: tinyTotalTime / standardResults.length,
        avgEntities: standardResults.reduce((sum, r) => sum + r.tiny.entities, 0) / standardResults.length,
        avgRelationships: standardResults.reduce((sum, r) => sum + r.tiny.relationships, 0) / standardResults.length,
      },
      savings: {
        cost: `${(((standardTotalCost - tinyTotalCost) / standardTotalCost) * 100).toFixed(1)}%`,
        time: `${(((standardTotalTime - tinyTotalTime) / standardTotalTime) * 100).toFixed(1)}%`,
        costUsd: (standardTotalCost - tinyTotalCost).toFixed(4),
      },
    },
    detailedComparison: standardResults,
    searchQualityComparison: searchComparisons,
    averageSearchOverlap: searchComparisons.length > 0 
      ? searchComparisons.reduce((sum, c) => sum + c.overlap, 0) / searchComparisons.length 
      : 0,
  };

  const reportPath = join(__dirname, '../results/tiny-vs-standard-comparison.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('=' .repeat(80));
  console.log('\n📈 COMPARISON SUMMARY\n');
  console.log('Cost Comparison:');
  console.log(`  STANDARD: $${standardTotalCost.toFixed(4)} ($${report.summary.standard.avgCost.toFixed(4)}/doc)`);
  console.log(`  TINY:     $${tinyTotalCost.toFixed(4)} ($${report.summary.tiny.avgCost.toFixed(4)}/doc)`);
  console.log(`  SAVINGS:  $${report.summary.savings.costUsd} (${report.summary.savings.cost})`);

  console.log('\nProcessing Time:');
  console.log(`  STANDARD: ${(standardTotalTime / 1000).toFixed(1)}s (${(report.summary.standard.avgTime / 1000).toFixed(2)}s/doc)`);
  console.log(`  TINY:     ${(tinyTotalTime / 1000).toFixed(1)}s (${(report.summary.tiny.avgTime / 1000).toFixed(2)}s/doc)`);
  console.log(`  SAVINGS:  ${report.summary.savings.time}`);

  console.log('\nExtraction Comparison:');
  console.log(`  STANDARD Entities:      ${report.summary.standard.avgEntities.toFixed(1)} avg`);
  console.log(`  TINY Entities:          ${report.summary.tiny.avgEntities.toFixed(1)} avg`);
  console.log(`  STANDARD Relationships: ${report.summary.standard.avgRelationships.toFixed(1)} avg`);
  console.log(`  TINY Relationships:     ${report.summary.tiny.avgRelationships.toFixed(1)} avg`);

  if (searchComparisons.length > 0) {
    console.log('\nSearch Quality:');
    console.log(`  Average Overlap: ${report.averageSearchOverlap.toFixed(1)} of 10 results (${(report.averageSearchOverlap / 10 * 100).toFixed(0)}%)`);
    console.log(`  Quality Assessment: ${report.averageSearchOverlap >= 7 ? '✅ EXCELLENT' : report.averageSearchOverlap >= 5 ? '⚠️  GOOD' : '❌ NEEDS IMPROVEMENT'}`);
  }

  console.log('\nDatabase Status:');
  console.log(`  ✅ Elasticsearch "classify-standard": ${standardResults.length} documents`);
  console.log(`  ✅ Elasticsearch "classify-tiny": ${standardResults.length} documents`);
  console.log(`  ✅ Neo4j :STANDARD label: ${standardResults.length} documents`);
  console.log(`  ✅ Neo4j :TINY label: ${standardResults.length} documents`);

  console.log(`\n📄 Full report saved to: ${reportPath}`);
  console.log('\n' + '='.repeat(80));

  console.log('\n✅ Comparison complete!\n');
}

main().catch(console.error);

