import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library export
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    shims: true,
    splitting: false,
    treeshake: true,
    minify: false,
    target: 'es2022',
    outDir: 'dist',
    esbuildOptions(options) {
      options.conditions = ['node'];
    },
  },
  // CLI entry point
  {
    entry: {
      cli: 'src/cli/index.ts',
    },
    format: ['esm'],
    dts: false, // CLI doesn't need types
    sourcemap: true,
    clean: false, // Don't clean (already cleaned above)
    shims: true,
    splitting: false,
    treeshake: true,
    minify: false,
    target: 'es2022',
    outDir: 'dist',
    esbuildOptions(options) {
      options.conditions = ['node'];
      options.banner = {
        js: '#!/usr/bin/env node',
      };
    },
  },
]);

