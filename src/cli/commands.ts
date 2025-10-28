/**
 * CLI Command Implementations
 */

import { ClassifyClient } from '../client.js';
import { ProjectMapper } from '../project/project-mapper.js';
import { ElasticsearchClient } from '../integrations/elasticsearch-client.js';
import { Neo4jClient } from '../integrations/neo4j-client.js';
import { writeFile } from 'fs/promises';
import * as path from 'path';

interface MapProjectOptions {
  output: string;
  provider: string;
  model?: string;
  concurrency: string;
  includeTests: boolean;
  template: string;
  cache: boolean;
  elasticsearchUrl: string;
  elasticsearchIndex: string;
  neo4jUrl: string;
  neo4jUser: string;
  neo4jPassword: string;
}

export async function mapProjectCommand(directory: string, options: MapProjectOptions): Promise<void> {
  console.log('\n🗺️  PROJECT MAPPER\n');
  console.log(`📂 Directory: ${directory}`);
  console.log(`🤖 Provider: ${options.provider}`);
  console.log(`⚙️  Concurrency: ${options.concurrency}`);
  console.log(`📝 Template: ${options.template}`);
  console.log('');

  // Initialize LLM client
  const client = new ClassifyClient({
    provider: options.provider as any,
    model: options.model,
    cacheEnabled: options.cache,
    compressionEnabled: true,
  });

  // Initialize databases
  const elasticsearch = new ElasticsearchClient({
    url: options.elasticsearchUrl,
    index: options.elasticsearchIndex,
  });

  const neo4j = new Neo4jClient({
    url: options.neo4jUrl,
    username: options.neo4jUser,
    password: options.neo4jPassword,
  });

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

  console.log('');

  // Create project mapper
  const mapper = new ProjectMapper(client);

  const startTime = Date.now();
  let indexedElastic = 0;
  let indexedNeo4j = 0;

  // Map project with progress callback
  const result = await mapper.mapProject(directory, {
    concurrency: parseInt(options.concurrency),
    includeTests: options.includeTests,
    useGitIgnore: true,
    buildRelationships: true,
    templateId: options.template,
    onProgress: (current, total, file) => {
      const percent = ((current / total) * 100).toFixed(1);
      const fileName = path.basename(file);
      process.stdout.write(`\r📦 [${current}/${total}] ${percent}% - ${fileName}${' '.repeat(50)}`);
    },
    onBatchComplete: async (batchResults) => {
      // Bulk insert into databases
      const validResults = batchResults
        .filter(item => item.result)
        .map(item => ({ result: item.result, file: item.filePath }));

      if (validResults.length === 0) return;

      // Elasticsearch bulk insert
      try {
        await elasticsearch.insertBatch(validResults);
        indexedElastic += validResults.length;
      } catch (error) {
        console.warn(`\n⚠️  Elasticsearch bulk insert failed:`, error instanceof Error ? error.message : error);
      }

      // Neo4j bulk insert
      try {
        await neo4j.insertBatch(validResults);
        indexedNeo4j += validResults.length;
      } catch (error) {
        console.warn(`\n⚠️  Neo4j bulk insert failed:`, error instanceof Error ? error.message : error);
      }
    },
  });

  const duration = Date.now() - startTime;

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 PROJECT MAPPING COMPLETE');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${(duration / 1000).toFixed(1)}s (${(duration / 60000).toFixed(1)} min)`);
  console.log(`📄 Files analyzed: ${result.statistics.totalFiles}`);
  console.log(`✅ Success: ${result.statistics.successfulFiles}`);
  console.log(`❌ Errors: ${result.statistics.failedFiles}`);
  console.log(`\n📊 Entities:`);
  console.log(`   - Total: ${result.statistics.totalEntities}`);
  console.log(`   - Types: ${result.statistics.entityTypes.length} different types`);
  console.log(`\n🔗 Relationships:`);
  console.log(`   - Total: ${result.statistics.totalRelationships}`);
  console.log(`   - Imports: ${result.statistics.totalImports}`);
  console.log(`   - Circular deps: ${result.circularDependencies.length}`);
  console.log(`\n💰 Costs:`);
  console.log(`   - Total: $${result.statistics.totalCost.toFixed(4)}`);
  console.log(`   - Average per file: $${result.statistics.averageCost.toFixed(6)}`);
  console.log(`\n🔍 Indexing:`);
  console.log(`   - Elasticsearch: ${indexedElastic} documents`);
  console.log(`   - Neo4j: ${indexedNeo4j} documents`);

  // Write unified Cypher to file
  console.log(`\n💾 Writing Cypher to: ${options.output}`);
  await writeFile(options.output, result.projectCypher);
  console.log(`✅ Cypher saved (${result.projectCypher.length} bytes)`);

  // Close database connections
  await elasticsearch.close();
  await neo4j.close();

  console.log('\n✅ All done!\n');
}

