#!/usr/bin/env tsx
/**
 * Example: Map a codebase with relationship analysis
 * 
 * This example demonstrates how to use ProjectMapper to analyze
 * an entire codebase, extract file relationships, and generate
 * Neo4j-compatible Cypher output.
 * 
 * Usage:
 *   npx tsx examples/map-project-example.ts [project-path]
 */

import { ProjectMapper, ClassifyClient } from '../src/index.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function main() {
  // Get project path from arguments or use current directory
  const projectPath = process.argv[2] || process.cwd();
  
  console.log(`\n🚀 Mapping project: ${projectPath}\n`);

  // Initialize client (using DeepSeek for cost efficiency)
  const client = new ClassifyClient({
    provider: 'deepseek',
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  // Initialize mapper
  const mapper = new ProjectMapper(client);

  // Track progress
  let lastProgress = 0;
  
  // Map the project
  const result = await mapper.mapProject(projectPath, {
    concurrency: 20,              // Process 20 files in parallel
    includeTests: false,          // Skip test files to save cost
    useGitIgnore: true,           // Respect .gitignore patterns
    buildRelationships: true,     // Analyze import/dependency graph
    
    // Progress callback
    onProgress: (current, total, file) => {
      const progress = Math.floor((current / total) * 100);
      if (progress > lastProgress + 5 || current === total) {
        console.log(`   [${current}/${total}] ${progress}% - ${file}`);
        lastProgress = progress;
      }
    },
  });

  // Display results
  console.log(`\n✅ Project mapping complete!\n`);
  
  console.log(`📊 Project Information:`);
  console.log(`   Name: ${result.project.name}`);
  console.log(`   Type: ${result.project.types.join(', ')}`);
  console.log(`   Primary Language: ${result.project.primaryLanguage}`);
  console.log(`   Entry Points: ${result.project.entryPoints.join(', ')}`);
  console.log(`   Config Files: ${result.project.configFiles.join(', ')}`);
  
  console.log(`\n📈 Statistics:`);
  console.log(`   Files Analyzed: ${result.statistics.totalFiles}`);
  console.log(`   Total Entities: ${result.statistics.totalEntities}`);
  console.log(`   Total Relationships: ${result.statistics.totalRelationships}`);
  console.log(`   Import Dependencies: ${result.statistics.totalImports}`);
  console.log(`   Processing Time: ${(result.statistics.processingTime / 1000).toFixed(2)}s`);
  console.log(`   Total Cost: $${result.statistics.totalCost.toFixed(4)}`);
  
  console.log(`\n🔤 Language Breakdown:`);
  for (const [lang, count] of Object.entries(result.statistics.byLanguage)) {
    console.log(`   ${lang}: ${count} files`);
  }
  
  console.log(`\n📄 Document Types:`);
  for (const [type, count] of Object.entries(result.statistics.byDocType)) {
    console.log(`   ${type}: ${count} files`);
  }

  // Analyze relationships
  if (result.relationships.length > 0) {
    const internalImports = result.relationships.filter(r => !r.isExternal);
    const externalImports = result.relationships.filter(r => r.isExternal);
    
    console.log(`\n🔗 Import Analysis:`);
    console.log(`   Total Imports: ${result.relationships.length}`);
    console.log(`   Internal: ${internalImports.length}`);
    console.log(`   External: ${externalImports.length}`);
    
    // Group by type
    const byType: Record<string, number> = {};
    for (const rel of result.relationships) {
      byType[rel.type] = (byType[rel.type] || 0) + 1;
    }
    console.log(`   By Type:`, byType);
  }

  // Check for circular dependencies
  if (result.circularDependencies.length > 0) {
    console.log(`\n⚠️  Circular Dependencies Detected: ${result.circularDependencies.length}`);
    for (let i = 0; i < Math.min(5, result.circularDependencies.length); i++) {
      const cycle = result.circularDependencies[i];
      console.log(`   ${i + 1}. ${cycle.join(' → ')}`);
    }
    if (result.circularDependencies.length > 5) {
      console.log(`   ... and ${result.circularDependencies.length - 5} more`);
    }
  } else {
    console.log(`\n✅ No circular dependencies detected`);
  }

  // Export outputs
  const outputDir = join(process.cwd(), 'output');
  const timestamp = new Date().toISOString().split('T')[0];
  
  console.log(`\n💾 Exporting results...`);
  
  // 1. Cypher output for Neo4j
  const cypherFile = join(outputDir, `${result.project.name}-${timestamp}.cypher`);
  await writeFile(cypherFile, result.projectCypher);
  console.log(`   ✅ Cypher: ${cypherFile}`);
  
  // 2. JSON summary
  const summaryFile = join(outputDir, `${result.project.name}-${timestamp}.json`);
  const summary = {
    project: result.project,
    statistics: result.statistics,
    circularDependencies: result.circularDependencies,
    files: result.files.map(f => ({
      path: f.path,
      entities: f.result.graphStructure.entities.length,
      relationships: f.result.graphStructure.relationships.length,
    })),
    relationships: result.relationships.slice(0, 100), // First 100 to keep file size reasonable
  };
  await writeFile(summaryFile, JSON.stringify(summary, null, 2));
  console.log(`   ✅ Summary: ${summaryFile}`);
  
  // 3. Relationship graph (CSV for visualization)
  if (result.relationships.length > 0) {
    const csvFile = join(outputDir, `${result.project.name}-${timestamp}-graph.csv`);
    const csvLines = ['from,to,type,isExternal'];
    for (const rel of result.relationships) {
      csvLines.push(`"${rel.from}","${rel.to}","${rel.type}",${rel.isExternal}`);
    }
    await writeFile(csvFile, csvLines.join('\n'));
    console.log(`   ✅ Graph CSV: ${csvFile}`);
  }

  console.log(`\n✨ Done! Import to Neo4j with:`);
  console.log(`   cypher-shell -f ${cypherFile}`);
  console.log(`\n   Or via HTTP:`);
  console.log(`   curl -X POST http://localhost:7474/db/neo4j/tx/commit \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"statements":[{"statement":"$(cat ${cypherFile})"}]}'`);
}

main().catch(console.error);

