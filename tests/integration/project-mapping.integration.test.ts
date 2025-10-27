import { describe, it, expect, beforeAll } from 'vitest';
import { ProjectMapper } from '../../src/project/project-mapper.js';
import { ProjectDetector } from '../../src/project/project-detector.js';
import { ClassifyClient } from '../../src/client.js';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

/**
 * Integration tests for Project Mapping
 * These tests use real projects to validate end-to-end functionality
 */
describe('Project Mapping Integration', () => {
  const projectRoot = join(process.cwd());
  let client: ClassifyClient;
  let mapper: ProjectMapper;

  beforeAll(() => {
    // Use DeepSeek for testing (cheapest option)
    client = new ClassifyClient({
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: process.env.DEEPSEEK_API_KEY || 'test-key',
    });

    mapper = new ProjectMapper(client);
  });

  describe('Project Detection', () => {
    it('should detect classify project (TypeScript)', async () => {
      const detector = new ProjectDetector();
      const project = await detector.detect(projectRoot);

      expect(project.name).toBe('@hivellm/classify');
      expect(project.types).toContain('nodejs');
      expect(project.primaryLanguage).toBe('typescript');
      expect(project.configFiles).toContain('package.json');
      expect(project.configFiles).toContain('tsconfig.json');
    });
  });

  describe('File Scanning', () => {
    it('should scan and filter files correctly', async () => {
      // This is a quick test that doesn't actually classify (would be expensive)
      // We just test the scanning and filtering logic
      
      const result = await mapper.mapProject(projectRoot, {
        concurrency: 1,
        includeTests: false,
        useGitIgnore: true,
        buildRelationships: false,
      });

      // Should find source files
      expect(result.statistics.totalFiles).toBeGreaterThan(0);
      
      // Should exclude node_modules, dist, etc
      const filePaths = result.files.map(f => f.path);
      expect(filePaths.every(p => !p.includes('node_modules'))).toBe(true);
      expect(filePaths.every(p => !p.includes('dist'))).toBe(true);
      expect(filePaths.every(p => !p.includes('coverage'))).toBe(true);

      console.log(`\n📊 Classify Project Analysis:`);
      console.log(`   Files scanned: ${result.statistics.totalFiles}`);
      console.log(`   Languages: ${Object.keys(result.statistics.byLanguage).join(', ')}`);
      console.log(`   Processing time: ${result.statistics.processingTime}ms`);
    }, 60000); // 60s timeout for real project scan

    it('should detect TypeScript imports', async () => {
      const result = await mapper.mapProject(join(projectRoot, 'src'), {
        concurrency: 1,
        includeTests: false,
        useGitIgnore: true,
        buildRelationships: true,
      });

      // Should find import relationships
      expect(result.relationships.length).toBeGreaterThan(0);
      
      // Should distinguish internal vs external imports
      const internalImports = result.relationships.filter(r => !r.isExternal);
      const externalImports = result.relationships.filter(r => r.isExternal);
      
      expect(internalImports.length).toBeGreaterThan(0);
      expect(externalImports.length).toBeGreaterThan(0);

      console.log(`\n🔗 Import Analysis:`);
      console.log(`   Total imports: ${result.relationships.length}`);
      console.log(`   Internal: ${internalImports.length}`);
      console.log(`   External: ${externalImports.length}`);
      console.log(`   Circular dependencies: ${result.circularDependencies.length}`);
    }, 60000);
  });

  describe('GitIgnore Integration', () => {
    it('should respect .gitignore patterns', async () => {
      const result = await mapper.mapProject(projectRoot, {
        concurrency: 1,
        includeTests: false,
        useGitIgnore: true,
        buildRelationships: false,
      });

      const filePaths = result.files.map(f => f.path);

      // Should NOT include any of these (they're in .gitignore)
      expect(filePaths.every(p => !p.includes('node_modules'))).toBe(true);
      expect(filePaths.every(p => !p.includes('.cache'))).toBe(true);
      expect(filePaths.every(p => !p.includes('dist/'))).toBe(true);
    }, 60000);

    it('should include all files when gitignore is disabled', async () => {
      const withGitIgnore = await mapper.mapProject(projectRoot, {
        concurrency: 1,
        includeTests: false,
        useGitIgnore: true,
        buildRelationships: false,
      });

      const withoutGitIgnore = await mapper.mapProject(projectRoot, {
        concurrency: 1,
        includeTests: false,
        useGitIgnore: false,
        buildRelationships: false,
      });

      // Without gitignore should find more files (or equal if default filters catch everything)
      expect(withoutGitIgnore.statistics.totalFiles).toBeGreaterThanOrEqual(
        withGitIgnore.statistics.totalFiles
      );

      console.log(`\n📁 GitIgnore Comparison:`);
      console.log(`   With .gitignore: ${withGitIgnore.statistics.totalFiles} files`);
      console.log(`   Without .gitignore: ${withoutGitIgnore.statistics.totalFiles} files`);
    }, 120000);
  });

  describe('Output Generation', () => {
    it('should generate valid Cypher output', async () => {
      const result = await mapper.mapProject(join(projectRoot, 'src/utils'), {
        concurrency: 1,
        includeTests: false,
        useGitIgnore: true,
        buildRelationships: true,
      });

      // Should have Cypher output
      expect(result.projectCypher).toBeTruthy();
      expect(result.projectCypher.length).toBeGreaterThan(0);

      // Should contain project node
      expect(result.projectCypher).toContain('CREATE (project:Project');
      expect(result.projectCypher).toContain('CONTAINS_FILE');

      // Should contain import relationships if any were found
      if (result.relationships.length > 0) {
        expect(result.projectCypher).toContain('IMPORTS');
      }

      console.log(`\n📜 Cypher Output:`);
      console.log(`   Length: ${result.projectCypher.length} characters`);
      console.log(`   Has Project node: ✅`);
      console.log(`   Has relationships: ${result.relationships.length > 0 ? '✅' : '❌'}`);
    }, 60000);

    it('should generate comprehensive statistics', async () => {
      const result = await mapper.mapProject(join(projectRoot, 'src'), {
        concurrency: 2,
        includeTests: false,
        useGitIgnore: true,
        buildRelationships: true,
      });

      const stats = result.statistics;

      expect(stats.totalFiles).toBeGreaterThan(0);
      expect(stats.totalEntities).toBeGreaterThan(0);
      expect(stats.totalRelationships).toBeGreaterThan(0);
      expect(stats.processingTime).toBeGreaterThan(0);
      
      // Should have language breakdown
      expect(Object.keys(stats.byLanguage).length).toBeGreaterThan(0);
      
      // Should have document type breakdown
      expect(Object.keys(stats.byDocType).length).toBeGreaterThan(0);

      console.log(`\n📊 Full Statistics:`);
      console.log(`   Files: ${stats.totalFiles}`);
      console.log(`   Entities: ${stats.totalEntities}`);
      console.log(`   Relationships: ${stats.totalRelationships}`);
      console.log(`   Imports: ${stats.totalImports}`);
      console.log(`   Cost: $${stats.totalCost.toFixed(4)}`);
      console.log(`   Time: ${stats.processingTime}ms`);
      console.log(`   Languages: ${JSON.stringify(stats.byLanguage, null, 2)}`);
    }, 120000);
  });

  describe('Error Handling', () => {
    it('should handle non-existent directory gracefully', async () => {
      await expect(
        mapper.mapProject('/non/existent/path', {
          concurrency: 1,
        })
      ).rejects.toThrow();
    });

    it('should continue on file errors', async () => {
      // Create a temporary directory with a mix of valid and invalid files
      const tempDir = join(process.cwd(), 'temp-test-' + Date.now());
      await mkdir(tempDir, { recursive: true });

      await writeFile(join(tempDir, 'valid.ts'), 'export const x = 1;');
      await writeFile(join(tempDir, 'invalid.ts'), 'this is not { valid typescript');

      const result = await mapper.mapProject(tempDir, {
        concurrency: 1,
        buildRelationships: true,
      });

      // Should process what it can
      expect(result.statistics.totalFiles).toBeGreaterThan(0);
    }, 30000);
  });
});

