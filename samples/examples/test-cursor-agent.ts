/**
 * Test cursor-agent provider with real vectorizer project
 * 
 * This example demonstrates:
 * - Using cursor-agent as a local LLM provider (zero cost)
 * - Mapping a real Rust project (vectorizer)
 * - Limiting to 100 files for testing
 * 
 * Prerequisites:
 * - cursor-agent must be installed: npm install -g cursor-agent
 * - cursor-agent must be logged in: cursor-agent login
 */

import { ClassifyClient } from '../../src/client.js';
import { ProjectMapper } from '../../src/project/project-mapper.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testCursorAgent() {
  console.log('🚀 Testing cursor-agent provider with ProjectMapper');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Create client with cursor-agent (no API key needed!)
  const client = new ClassifyClient({
    provider: 'cursor-agent',
    cacheEnabled: false, // Disable cache for fresh results
  });

  console.log('✅ Client created with cursor-agent provider');
  console.log('   - Provider: cursor-agent (local execution)');
  console.log('   - Cost: $0.00');
  console.log('   - Privacy: 100% local\n');

  // Create project mapper
  const mapper = new ProjectMapper(client);

  // Test with vectorizer project (use relative path for WSL compatibility)
  const vectorizerPath = path.join(process.cwd(), '../vectorizer');

  console.log(`📁 Scanning: ${vectorizerPath}`);
  console.log('⏳ This may take 10-30 minutes with cursor-agent...\n');

  const startTime = Date.now();

  try {
    const result = await mapper.mapProject(vectorizerPath, {
      maxFiles: 100, // Limit to 100 files for testing
      includeTests: false,
      ignorePatterns: ['node_modules', 'target', 'dist', '.git', 'coverage'],
    });

    const duration = Date.now() - startTime;

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCESS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Statistics:');
    console.log(`  - Files scanned: ${result.statistics.totalFiles}`);
    console.log(`  - Files categorized: ${result.statistics.categorizedFiles}`);
    console.log(`  - Duration: ${(duration / 1000 / 60).toFixed(2)} minutes`);
    console.log(`  - Cost: $0.00 (cursor-agent is free!)`);
    console.log('');

    console.log('📁 File Categories:');
    for (const [category, count] of Object.entries(result.statistics.filesByCategory)) {
      console.log(`  - ${category}: ${count}`);
    }

    console.log('\n📊 Language Distribution:');
    for (const [lang, count] of Object.entries(result.statistics.filesByLanguage)) {
      console.log(`  - ${lang}: ${count}`);
    }

    // Save Cypher output
    const cypherPath = path.join(__dirname, '../results/cursor-agent-vectorizer-100.cypher');
    const fs = await import('fs');
    fs.writeFileSync(cypherPath, result.cypher);
    console.log(`\n💾 Cypher output saved to: ${cypherPath}`);

    // Save JSON summary
    const jsonPath = path.join(__dirname, '../results/cursor-agent-vectorizer-100.json');
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          provider: 'cursor-agent',
          duration_ms: duration,
          duration_minutes: duration / 1000 / 60,
          cost: 0,
          statistics: result.statistics,
          project_structure: result.projectStructure,
        },
        null,
        2
      )
    );
    console.log(`💾 JSON summary saved to: ${jsonPath}`);

    console.log('\n✨ Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   - Load the Cypher into Neo4j/Nexus');
    console.log('   - Explore the project graph');
    console.log('   - Compare with API provider results');
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    
    if (error instanceof Error && error.message.includes('cursor-agent not found')) {
      console.error('\n💡 Fix: Install cursor-agent');
      console.error('   npm install -g cursor-agent');
      console.error('   cursor-agent login');
    }
    
    process.exit(1);
  }
}

testCursorAgent();

