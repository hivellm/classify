#!/usr/bin/env tsx
import { glob } from 'glob';
import { join } from 'path';

const VECTORIZER_DIR = join(process.cwd(), '..', 'vectorizer');
const DEFAULT_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/target/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/.git/**',
];

const patterns = ['**/*.rs', '**/*.toml', '**/*.md', '**/*.json', '**/*.yml', '**/*.yaml', '**/*.sh'];

async function count() {
  let total = 0;
  const byType: Record<string, number> = {};
  
  for (const pattern of patterns) {
    const matches = await glob(join(VECTORIZER_DIR, pattern), {
      ignore: [
        ...DEFAULT_IGNORE_PATTERNS,
        '**/examples/**',
        '**/tests/fixtures/**',
        '**/qdrant/**',           // 1.3k files
        '**/sample/**',           // 59k files!
        '**/samples/**',
        '**/client-sdks/**',      // 48k files!
        '**/gui/**',              // 20k files
        '**/data/**',
        '**/models/**',
        '**/assets/**',
        '**/dashboard/**',
        '**/benchmark/reports/**', // Benchmark results
        '**/wix/**',
        '**/pkg/**',
        '**/debian/**',
      ],
    });
    const ext = pattern.split('*').pop()?.replace('.', '') || 'unknown';
    byType[ext] = matches.length;
    total += matches.length;
  }
  
  console.log('📊 Files found after filtering:\n');
  console.log(`   Total: ${total} files\n`);
  console.log('   By type:');
  Object.entries(byType).forEach(([ext, count]) => {
    console.log(`     .${ext}: ${count}`);
  });
  
  console.log(`\n   Reduction: ${5530 - total} files filtered out`);
}

count();

