import { describe, it, expect } from 'vitest';
import {
  DEFAULT_IGNORE_PATTERNS,
  shouldIgnore,
  mergeIgnorePatterns,
} from '../../src/utils/ignore-patterns.js';

describe('ignore-patterns', () => {
  describe('DEFAULT_IGNORE_PATTERNS', () => {
    it('should contain common patterns', () => {
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/node_modules/**');
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/dist/**');
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/.git/**');
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/coverage/**');
    });

    it('should contain language-specific patterns', () => {
      // Rust
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/target/**');
      // Java
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/*.class');
      // Python
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/*.pyc');
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/__pycache__/**');
    });

    it('should contain binary patterns', () => {
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/*.exe');
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/*.dll');
      expect(DEFAULT_IGNORE_PATTERNS).toContain('**/*.so');
    });
  });

  describe('shouldIgnore', () => {
    it('should ignore node_modules', () => {
      expect(shouldIgnore('project/node_modules/package/index.js', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('src/node_modules/test.js', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore dist directory', () => {
      expect(shouldIgnore('project/dist/index.js', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('src/dist/bundle.js', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore .git directory', () => {
      expect(shouldIgnore('project/.git/config', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('repo/.git/HEAD', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore binary files', () => {
      expect(shouldIgnore('project/app.exe', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('lib/library.dll', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('build/lib.so', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('lib/module.dylib', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore compiled files', () => {
      expect(shouldIgnore('com/Main.class', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('src/module.pyc', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('build/file.o', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore log files', () => {
      expect(shouldIgnore('project/app.log', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('logs/error.log', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore IDE files', () => {
      expect(shouldIgnore('.idea/workspace.xml', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('project/.vs/config', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore coverage directory', () => {
      expect(shouldIgnore('coverage/lcov.info', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should ignore cache directories', () => {
      expect(shouldIgnore('project/.cache/file', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('__pycache__/module.pyc', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });
    
    it('should ignore Python environments', () => {
      expect(shouldIgnore('venv/lib/python3.9', DEFAULT_IGNORE_PATTERNS)).toBe(true);
      expect(shouldIgnore('.venv/bin/activate', DEFAULT_IGNORE_PATTERNS)).toBe(true);
    });

    it('should NOT ignore source files', () => {
      expect(shouldIgnore('src/index.ts', DEFAULT_IGNORE_PATTERNS)).toBe(false);
      expect(shouldIgnore('lib/main.js', DEFAULT_IGNORE_PATTERNS)).toBe(false);
      expect(shouldIgnore('app.py', DEFAULT_IGNORE_PATTERNS)).toBe(false);
      expect(shouldIgnore('main.rs', DEFAULT_IGNORE_PATTERNS)).toBe(false);
    });

    it('should NOT ignore documentation', () => {
      expect(shouldIgnore('README.md', DEFAULT_IGNORE_PATTERNS)).toBe(false);
      expect(shouldIgnore('docs/api.md', DEFAULT_IGNORE_PATTERNS)).toBe(false);
    });

    it('should NOT ignore config files', () => {
      expect(shouldIgnore('package.json', DEFAULT_IGNORE_PATTERNS)).toBe(false);
      expect(shouldIgnore('tsconfig.json', DEFAULT_IGNORE_PATTERNS)).toBe(false);
      expect(shouldIgnore('Cargo.toml', DEFAULT_IGNORE_PATTERNS)).toBe(false);
    });

    it('should use custom patterns when provided', () => {
      const customPatterns = ['test-files', '*.tmp'];
      expect(shouldIgnore('test-files/test.js', customPatterns)).toBe(true);
      expect(shouldIgnore('file.tmp', customPatterns)).toBe(true);
      expect(shouldIgnore('src/index.ts', customPatterns)).toBe(false);
    });
  });

  describe('mergeIgnorePatterns', () => {
    it('should merge custom patterns with defaults', () => {
      const custom = ['*.custom', 'custom-dir'];
      const merged = mergeIgnorePatterns(custom);

      expect(merged).toContain('*.custom');
      expect(merged).toContain('custom-dir');
      expect(merged).toContain('**/node_modules/**');
      expect(merged).toContain('**/dist/**');
    });

    it('should include both default and custom patterns', () => {
      const custom = ['custom'];
      const merged = mergeIgnorePatterns(custom);

      expect(merged).toContain('**/node_modules/**');
      expect(merged).toContain('custom');
      expect(merged.length).toBeGreaterThan(DEFAULT_IGNORE_PATTERNS.length);
    });

    it('should handle empty custom patterns', () => {
      const merged = mergeIgnorePatterns([]);
      expect(merged).toEqual(DEFAULT_IGNORE_PATTERNS);
    });

    it('should handle undefined custom patterns', () => {
      const merged = mergeIgnorePatterns();
      expect(merged).toEqual(DEFAULT_IGNORE_PATTERNS);
    });
  });
});

