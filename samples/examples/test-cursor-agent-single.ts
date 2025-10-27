/**
 * Simple test - classify ONE file with cursor-agent
 */

import { ClassifyClient } from '../../src/client.js';

async function testSingle() {
  console.log('🧪 Testing cursor-agent with single file\n');

  const client = new ClassifyClient({
    provider: 'cursor-agent',
    cacheEnabled: false,
  });

  console.log('✅ Client created\n');

  // Test with a simple markdown file (use WSL path or relative path)
  const testFile = './README.md';

  console.log(`📄 Classifying: ${testFile}\n`);
  console.log('⏳ Waiting for cursor-agent response...\n');

  try {
    const result = await client.classify(testFile);

    console.log('\n✅ SUCCESS!');
    console.log('\n📊 Result:');
    console.log(`  - Template: ${result.classification.template}`);
    console.log(`  - Domain: ${result.classification.domain}`);
    console.log(`  - Doc Type: ${result.classification.docType}`);
    console.log(`  - Tokens: ${result.performance.tokensUsed.input} + ${result.performance.tokensUsed.output}`);
    console.log(`  - Cost: $${result.performance.costUsd}`);
    console.log(`  - Time: ${result.performance.totalTimeMs}ms`);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    if (error instanceof Error) {
      console.error('\nStack:', error.stack);
    }
    process.exit(1);
  }
}

testSingle();

