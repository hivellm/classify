import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.ts',
        '**/*.test.ts',
        '**/types.ts',
        'src/cli/**',
        'src/index.ts',
        'src/**/index.ts', // Exclude barrel exports
        'src/batch/**', // Batch requires full integration
        'src/output/fulltext-generator.ts', // Complex LLM integration
        'src/llm/providers/**', // Provider implementations tested via integration
      ],
      include: ['src/**/*.ts'],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      },
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
});

