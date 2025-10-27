#!/usr/bin/env node

/**
 * Example: Map Entire Project
 * 
 * Demonstrates using ProjectMapper to map an entire codebase
 */

import { ClassifyClient, ProjectMapper } from '../../src/index.js';
import { writeFile } from 'fs/promises';

async function main() {
  const projectDir = process.argv[2] || '.';
  
  console.log('🗺️  Project Mapping Example\n');
  console.log('=' .repeat(80));
  console.log(`\nProject Directory: ${projectDir}\n`);

  // Initialize client (use TINY templates for cost savings)
  const client = new ClassifyClient({
    provider: 'deepseek',
    cacheEnabled: true,
    compressionEnabled: true,
    // templatesDir defaults to 'templates/tiny' (cost-optimized)
  });

  // Create project mapper
  const mapper = new ProjectMapper(client);

  // Map the project
  const result = await mapper.mapProject(projectDir, {
    concurrency: 20,
    includeTests: false,
    onProgress: (current, total, file) => {
      const percent = ((current / total) * 100).toFixed(1);
      const fileName = file.split(/[/\\]/).pop();
      process.stdout.write(`\r📊 Progress: ${current}/${total} (${percent}%) - ${fileName}          `);
    },
  });

  console.log('\n\n' + '='.repeat(80));
  console.log('\n📈 PROJECT MAPPING COMPLETE\n');

  // Print project info
  console.log('Project Information:');
  console.log(`  Name: ${result.project.name}`);
  console.log(`  Type: ${result.project.types.join(', ')}`);
  console.log(`  Language: ${result.project.primaryLanguage}`);
  console.log(`  Entry Points: ${result.project.entryPoints.join(', ')}`);
  console.log(`  Config Files: ${result.project.configFiles.join(', ')}\n`);

  // Print statistics
  console.log('Statistics:');
  console.log(`  Total Files: ${result.statistics.totalFiles}`);
  console.log(`  Total Entities: ${result.statistics.totalEntities}`);
  console.log(`  Total Relationships: ${result.statistics.totalRelationships}`);
  console.log(`  Total Cost: $${result.statistics.totalCost.toFixed(4)}`);
  console.log(`  Processing Time: ${(result.statistics.processingTime / 1000).toFixed(1)}s\n`);

  // Print breakdown
  console.log('By Language:');
  for (const [lang, count] of Object.entries(result.statistics.byLanguage)) {
    console.log(`  ${lang}: ${count} files`);
  }

  console.log('\nBy Document Type:');
  for (const [type, count] of Object.entries(result.statistics.byDocType)) {
    console.log(`  ${type}: ${count} files`);
  }

  // Save Cypher
  const cypherPath = `project-map-${result.project.name}.cypher`;
  await writeFile(cypherPath, result.projectCypher);
  console.log(`\n📄 Unified Cypher saved to: ${cypherPath}`);

  // Save JSON summary
  const jsonPath = `project-map-${result.project.name}.json`;
  await writeFile(
    jsonPath,
    JSON.stringify(
      {
        project: result.project,
        statistics: result.statistics,
        files: result.files.map(f => ({
          path: f.path,
          title: f.result.fulltextMetadata.title,
          domain: f.result.classification.domain,
          docType: f.result.classification.docType,
          entities: f.result.graphStructure.entities.length,
          relationships: f.result.graphStructure.relationships.length,
        })),
      },
      null,
      2
    )
  );
  console.log(`📄 Project summary saved to: ${jsonPath}\n`);

  console.log('=' .repeat(80));
  console.log('\n✅ Project mapping complete!\n');

  console.log('Next steps:');
  console.log(`  1. Import to Neo4j: cat ${cypherPath} | cypher-shell -u neo4j -p password`);
  console.log(`  2. Explore in Neo4j Browser: http://localhost:7474/browser/`);
  console.log(`  3. Query: MATCH (p:Project {name: "${result.project.name}"})-[:CONTAINS_FILE]->(d) RETURN count(d)\n`);
}

main().catch(console.error);

