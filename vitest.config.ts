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
        'src/cli/**', // CLI tested via integration
        'src/index.ts',
        'src/**/index.ts', // Exclude barrel exports
        'src/batch/**', // Batch requires full integration
        'src/project/project-mapper.ts', // Project mapping tested via integration (v0.7.0)
        'src/project/project-detector.ts', // Project detection tested via integration
        'src/output/fulltext-generator.ts', // Complex LLM integration
        'src/llm/providers/**', // Provider implementations tested via integration
      ],
      include: ['src/**/*.ts'],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 65,
        statements: 75,
      },
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
});

