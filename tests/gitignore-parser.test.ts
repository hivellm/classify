import { describe, it, expect, beforeEach } from 'vitest';
import { GitIgnoreParser } from '../src/utils/gitignore-parser.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('GitIgnoreParser', () => {
  let parser: GitIgnoreParser;
  let testDir: string;

  beforeEach(async () => {
    parser = new GitIgnoreParser();
    testDir = join(tmpdir(), `gitignore-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  describe('parsePattern', () => {
    it('should parse simple patterns', () => {
      parser.addPatterns(['node_modules', '*.log', 'dist/'], 'test');
      const patterns = parser.getPatterns();

      expect(patterns).toHaveLength(3);
      expect(patterns[0].original).toBe('node_modules');
      expect(patterns[1].original).toBe('*.log');
      expect(patterns[2].directoryOnly).toBe(true);
    });

    it('should parse negation patterns', () => {
      parser.addPatterns(['*.log', '!important.log'], 'test');
      const patterns = parser.getPatterns();

      expect(patterns).toHaveLength(2);
      expect(patterns[0].negation).toBe(false);
      expect(patterns[1].negation).toBe(true);
      expect(patterns[1].original).toBe('important.log');
    });

    it('should handle directory-only patterns', () => {
      parser.addPatterns(['build/', 'dist/'], 'test');
      const patterns = parser.getPatterns();

      expect(patterns).toHaveLength(2);
      expect(patterns[0].directoryOnly).toBe(true);
      expect(patterns[1].directoryOnly).toBe(true);
    });

    it('should handle glob patterns', () => {
      parser.addPatterns(['*.js', 'src/*.test.ts'], 'test');
      const patterns = parser.getPatterns();

      expect(patterns).toHaveLength(2);
      expect(patterns[0].original).toBe('*.js');
      expect(patterns[1].original).toBe('src/*.test.ts');
    });
  });

  describe('shouldIgnore', () => {
    it('should ignore files matching simple patterns', () => {
      parser.addPatterns(['node_modules', '*.log'], 'test');

      expect(parser.shouldIgnore('node_modules/package.json')).toBe(true);
      expect(parser.shouldIgnore('src/node_modules/index.js')).toBe(true);
      expect(parser.shouldIgnore('debug.log')).toBe(true);
      expect(parser.shouldIgnore('src/app.log')).toBe(true);
      expect(parser.shouldIgnore('src/index.js')).toBe(false);
    });

    it('should handle negation patterns correctly', () => {
      parser.addPatterns(['*.log', '!important.log'], 'test');

      expect(parser.shouldIgnore('debug.log')).toBe(true);
      expect(parser.shouldIgnore('error.log')).toBe(true);
      expect(parser.shouldIgnore('important.log')).toBe(false);
    });

    it('should handle directory patterns', () => {
      parser.addPatterns(['node_modules', 'dist'], 'test');

      expect(parser.shouldIgnore('node_modules/package.json')).toBe(true);
      expect(parser.shouldIgnore('src/node_modules/lib/index.js')).toBe(true);
      expect(parser.shouldIgnore('dist/bundle.js')).toBe(true);
      expect(parser.shouldIgnore('build/dist/main.js')).toBe(true);
      expect(parser.shouldIgnore('src/index.js')).toBe(false);
    });

    it('should handle rooted patterns (starting with /)', () => {
      parser.addPatterns(['/build', '/dist'], 'test');

      // Rooted patterns match only from root (with leading /)
      expect(parser.shouldIgnore('/build/output.js')).toBe(true);
      expect(parser.shouldIgnore('/dist/bundle.js')).toBe(true);
      // Should not match nested paths
      expect(parser.shouldIgnore('src/build/index.js')).toBe(false);
      expect(parser.shouldIgnore('src/dist/main.js')).toBe(false);
    });

    it('should handle Windows-style paths', () => {
      parser.addPatterns(['node_modules', 'dist'], 'test');

      expect(parser.shouldIgnore('C:\\project\\node_modules\\lib.js')).toBe(true);
      expect(parser.shouldIgnore('C:\\project\\dist\\bundle.js')).toBe(true);
      expect(parser.shouldIgnore('C:\\project\\src\\index.js')).toBe(false);
    });

    it('should respect pattern order for negations', () => {
      parser.addPatterns(['*.log', '!debug.log', '*.log'], 'test');

      // Last pattern should win
      expect(parser.shouldIgnore('debug.log')).toBe(true);
    });
  });

  describe('loadFromFile', () => {
    it('should load and parse .gitignore file', async () => {
      const gitignorePath = join(testDir, '.gitignore');
      const content = `
# Comment
node_modules
*.log
!important.log
dist/
      `.trim();

      await writeFile(gitignorePath, content, 'utf-8');
      await parser.loadFromFile(gitignorePath);

      const patterns = parser.getPatterns();
      expect(patterns.length).toBeGreaterThan(0);
      expect(parser.shouldIgnore('node_modules/lib.js')).toBe(true);
      expect(parser.shouldIgnore('debug.log')).toBe(true);
      expect(parser.shouldIgnore('important.log')).toBe(false);
    });

    it('should skip empty lines and comments', async () => {
      const gitignorePath = join(testDir, '.gitignore');
      const content = `
# This is a comment

node_modules

# Another comment
*.log
      `.trim();

      await writeFile(gitignorePath, content, 'utf-8');
      await parser.loadFromFile(gitignorePath);

      const patterns = parser.getPatterns();
      // Should only have 2 patterns (node_modules, *.log)
      expect(patterns).toHaveLength(2);
    });

    it('should handle non-existent file gracefully', async () => {
      await parser.loadFromFile(join(testDir, 'non-existent.gitignore'));
      expect(parser.getPatterns()).toHaveLength(0);
    });
  });

  describe('loadCascading', () => {
    it('should load .gitignore files from parent directories', async () => {
      const rootGitignore = join(testDir, '.gitignore');
      const subDir = join(testDir, 'src');
      const subGitignore = join(subDir, '.gitignore');

      await mkdir(subDir, { recursive: true });
      await writeFile(rootGitignore, 'node_modules\n*.log', 'utf-8');
      await writeFile(subGitignore, 'dist\n*.test.js', 'utf-8');

      await parser.loadCascading(subDir);

      const patterns = parser.getPatterns();
      expect(patterns.length).toBeGreaterThan(0);
      
      // Should have patterns from both files
      expect(parser.shouldIgnore('node_modules/lib.js')).toBe(true);
      expect(parser.shouldIgnore('dist/bundle.js')).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all patterns', () => {
      parser.addPatterns(['node_modules', '*.log'], 'test');
      expect(parser.getPatterns()).toHaveLength(2);

      parser.clear();
      expect(parser.getPatterns()).toHaveLength(0);
    });
  });

  describe('real-world patterns', () => {
    beforeEach(() => {
      const realWorldPatterns = [
        '# Dependencies',
        'node_modules/',
        'bower_components/',
        '',
        '# Build outputs',
        'dist/',
        'build/',
        '*.min.js',
        '',
        '# Logs',
        '*.log',
        'logs/',
        '',
        '# IDE',
        '.vscode/',
        '.idea/',
        '*.swp',
        '',
        '# OS',
        '.DS_Store',
        'Thumbs.db',
        '',
        '# Environment',
        '.env',
        '.env.local',
      ];

      parser.addPatterns(realWorldPatterns.filter(p => p && !p.startsWith('#')), 'real-world');
    });

    it('should handle typical project structure', () => {
      expect(parser.shouldIgnore('node_modules/express/index.js')).toBe(true);
      expect(parser.shouldIgnore('dist/bundle.min.js')).toBe(true);
      expect(parser.shouldIgnore('build/output.js')).toBe(true);
      expect(parser.shouldIgnore('error.log')).toBe(true);
      expect(parser.shouldIgnore('logs/debug.log')).toBe(true);
      expect(parser.shouldIgnore('.vscode/settings.json')).toBe(true);
      expect(parser.shouldIgnore('.env.local')).toBe(true);
      
      expect(parser.shouldIgnore('src/index.js')).toBe(false);
      expect(parser.shouldIgnore('src/components/App.tsx')).toBe(false);
      expect(parser.shouldIgnore('package.json')).toBe(false);
    });
  });
});

