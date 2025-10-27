import { config } from 'dotenv';
config();

import { ClassifyClient } from '../dist/index.js';
import { join } from 'path';

async function main() {
  console.log('Testing classification of AuthService.ts...\n');

  const client = new ClassifyClient({
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: false,
    templatesDir: join(process.cwd(), 'templates'),
  });

  const result = await client.classify('samples/code/typescript/AuthService.ts', {
    templateId: 'software_project',
  });

  console.log('Result:', JSON.stringify(result, null, 2).substring(0, 1000));
  
  console.log('\n✅ DocType:', result.classification?.docType);
  console.log('✅ Entities:', result.graphStructure?.entities?.length || 0);
  console.log('✅ Relationships:', result.graphStructure?.relationships?.length || 0);
  
  if (result.graphStructure?.entities?.length > 0) {
    console.log('\nTop 10 entities:');
    result.graphStructure.entities.slice(0, 10).forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.type}: ${e.properties.name || e.properties.title || 'N/A'}`);
    });
  }
  
  if (result.graphStructure?.relationships?.length > 0) {
    console.log('\nTop 5 relationships:');
    result.graphStructure.relationships.slice(0, 5).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.type}: ${r.source} → ${r.target}`);
    });
  }
  
  console.log(`\n💰 Cost: $${result.performance?.costUsd?.toFixed(6) || 0}`);
  console.log(`⏱️  Time: ${result.performance?.totalTimeMs || 0}ms`);
}

main().catch(console.error);

