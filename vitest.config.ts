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
      ],
      include: ['src/**/*.ts'],
      thresholds: {
        lines: 40,
        functions: 60,
        branches: 70,
        statements: 40,
      },
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
});

