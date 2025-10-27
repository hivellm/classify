import { glob } from 'glob';
import { ProjectDetector, type ProjectInfo } from './project-detector.js';
import { RelationshipBuilder, type FileRelationship } from './relationship-builder.js';
import { BatchProcessor } from '../batch/batch-processor.js';
import type { ClassifyClient } from '../client.js';
import type { ClassifyResult } from '../types.js';
import { shouldIgnore, DEFAULT_IGNORE_PATTERNS } from '../utils/ignore-patterns.js';
import { GitIgnoreParser } from '../utils/gitignore-parser.js';

/**
 * Project mapping result
 */
export interface ProjectMapResult {
  /** Project information */
  project: ProjectInfo;

  /** File classification results */
  files: Array<{
    path: string;
    result: ClassifyResult;
  }>;

  /** File relationships (imports/dependencies) */
  relationships: FileRelationship[];

  /** Circular dependencies detected */
  circularDependencies: string[][];

  /** Project statistics */
  statistics: {
    totalFiles: number;
    totalEntities: number;
    totalRelationships: number;
    totalImports: number;
    byLanguage: Record<string, number>;
    byDocType: Record<string, number>;
    totalCost: number;
    processingTime: number;
  };

  /** Unified Cypher for entire project */
  projectCypher: string;
}

/**
 * Maps an entire project directory
 */
export class ProjectMapper {
  constructor(private client: ClassifyClient) {}

  /**
   * Map entire project
   */
  async mapProject(
    directory: string,
    options: {
      concurrency?: number;
      includeTests?: boolean;
      templateId?: string;
      useGitIgnore?: boolean;
      buildRelationships?: boolean;
      onProgress?: (current: number, total: number, file: string) => void;
    } = {}
  ): Promise<ProjectMapResult> {
    const startTime = Date.now();

    // Detect project info
    console.log('🔍 Detecting project structure...');
    const detector = new ProjectDetector();
    const project = await detector.detect(directory);
    
    console.log(`✅ Project: ${project.name} (${project.primaryLanguage})`);
    console.log(`   Types: ${project.types.join(', ')}`);
    console.log(`   Entry points: ${project.entryPoints.join(', ')}\n`);

    // Load .gitignore if requested
    let gitignoreParser: GitIgnoreParser | undefined;
    if (options.useGitIgnore !== false) {
      console.log('📋 Loading .gitignore...');
      gitignoreParser = new GitIgnoreParser();
      await gitignoreParser.loadCascading(directory);
      console.log(`   Loaded ${gitignoreParser.getPatterns().length} patterns\n`);
    }

    // Find all source files
    console.log('📂 Scanning files...');
    const pattern = '**/*.{ts,js,jsx,tsx,rs,py,java,go,md,json,yml,yaml,toml,sh}';
    const allFiles = await glob(pattern, {
      cwd: directory,
      absolute: true,
      ignore: ['**/node_modules/**', '**/target/**', '**/dist/**', '**/build/**'],
    });

    // Filter files
    const filteredFiles = allFiles.filter(file => {
      // Check gitignore first
      if (gitignoreParser?.shouldIgnore(file, directory)) {
        return false;
      }

      // Check default ignore patterns
      const shouldSkip = shouldIgnore(file, [...DEFAULT_IGNORE_PATTERNS]);
      
      // Optionally exclude tests
      if (!options.includeTests && file.match(/test|spec|__tests__|__mocks__/i)) {
        return false;
      }
      
      return !shouldSkip;
    });

    console.log(`   Found ${allFiles.length} files, ${filteredFiles.length} after filtering\n`);

    // Classify files in parallel
    console.log('📊 Classifying files...');
    const processor = new BatchProcessor(this.client);
    
    const results: Array<{ path: string; result: ClassifyResult }> = [];
    
    const batchResult = await processor.processFiles(filteredFiles, {
      concurrency: options.concurrency ?? 20,
      continueOnError: true,
      templateId: options.templateId,
      onBatchComplete: async (batch) => {
        // Filter successful results
        const successful = batch.filter(b => b.result);
        for (const item of successful) {
          if (item.result) {
            results.push({ path: item.filePath, result: item.result });
          }
        }
        
        // Call user progress callback if provided
        if (options.onProgress) {
          const lastFile = batch[batch.length - 1];
          options.onProgress(results.length, filteredFiles.length, lastFile?.filePath ?? '');
        }
      },
    });

    console.log(`\n✅ Classified ${batchResult.successCount} files (${batchResult.failureCount} failed)\n`);

    // Build file relationships (imports/dependencies)
    let relationships: FileRelationship[] = [];
    let circularDependencies: string[][] = [];

    if (options.buildRelationships !== false) {
      console.log('🔗 Building file relationships...');
      const relationshipBuilder = new RelationshipBuilder();

      for (const file of filteredFiles) {
        try {
          await relationshipBuilder.analyzeFile(file, directory);
        } catch (error) {
          console.warn(`   Warning: Could not analyze ${file}: ${error}`);
        }
      }

      relationships = relationshipBuilder.getRelationships();
      circularDependencies = relationshipBuilder.detectCircularDependencies();

      console.log(`   Found ${relationships.length} import relationships`);
      if (circularDependencies.length > 0) {
        console.log(`   ⚠️  Detected ${circularDependencies.length} circular dependencies\n`);
      } else {
        console.log(`   ✅ No circular dependencies detected\n`);
      }
    }

    // Calculate statistics
    const statistics = this.calculateStatistics(results, relationships);

    // Generate unified Cypher
    const projectCypher = this.generateProjectCypher(project, results, relationships);

    const processingTime = Date.now() - startTime;

    return {
      project,
      files: results,
      relationships,
      circularDependencies,
      statistics: {
        ...statistics,
        processingTime,
      },
      projectCypher,
    };
  }

  /**
   * Calculate project statistics
   */
  private calculateStatistics(
    results: Array<{ path: string; result: ClassifyResult }>,
    relationships: FileRelationship[]
  ): {
    totalFiles: number;
    totalEntities: number;
    totalRelationships: number;
    totalImports: number;
    byLanguage: Record<string, number>;
    byDocType: Record<string, number>;
    totalCost: number;
  } {
    let totalEntities = 0;
    let totalRelationships = 0;
    let totalCost = 0;
    const byLanguage: Record<string, number> = {};
    const byDocType: Record<string, number> = {};

    for (const { result } of results) {
      totalEntities += result.graphStructure.entities.length;
      totalRelationships += result.graphStructure.relationships.length;
      totalCost += result.performance.costUsd ?? 0;

      const domain = result.classification.domain;
      byLanguage[domain] = (byLanguage[domain] ?? 0) + 1;

      const docType = result.classification.docType;
      byDocType[docType] = (byDocType[docType] ?? 0) + 1;
    }

    return {
      totalFiles: results.length,
      totalEntities,
      totalRelationships,
      totalImports: relationships.length,
      byLanguage,
      byDocType,
      totalCost,
    };
  }

  /**
   * Generate unified Cypher for entire project
   */
  private generateProjectCypher(
    project: ProjectInfo,
    results: Array<{ path: string; result: ClassifyResult }>,
    relationships: FileRelationship[]
  ): string {
    const statements: string[] = [];

    // Create project node
    statements.push(`// Project: ${project.name}`);
    statements.push(
      `CREATE (project:Project {
  name: "${project.name}",
  type: "${project.types.join(', ')}",
  primaryLanguage: "${project.primaryLanguage}",
  totalFiles: ${results.length},
  rootDir: "${project.rootDir.replace(/\\/g, '/')}"
})`
    );
    statements.push('');

    // Create a map of file path to document title
    const pathToTitle = new Map<string, string>();
    for (const { path, result } of results) {
      pathToTitle.set(path.replace(/\\/g, '/'), result.fulltextMetadata.title);
    }

    // Add all file Cypher statements
    for (const { path, result } of results) {
      statements.push(`// File: ${path}`);
      statements.push(result.graphStructure.cypher);
      statements.push('');
      
      // Link file to project
      const docTitle = result.fulltextMetadata.title;
      statements.push(
        `MATCH (doc:Document {title: "${docTitle}"}), (project:Project {name: "${project.name}"})`
      );
      statements.push(`CREATE (project)-[:CONTAINS_FILE]->(doc)`);
      statements.push('');
    }

    // Add import relationships
    if (relationships.length > 0) {
      statements.push('// File Import Relationships');
      statements.push('');

      for (const rel of relationships) {
        // Only create relationships for internal files
        if (!rel.isExternal) {
          const fromTitle = pathToTitle.get(rel.from.replace(/\\/g, '/'));
          const toTitle = pathToTitle.get(rel.to.replace(/\\/g, '/'));

          if (fromTitle && toTitle) {
            statements.push(
              `MATCH (from:Document {title: "${fromTitle}"}), (to:Document {title: "${toTitle}"})`
            );
            statements.push(
              `CREATE (from)-[:IMPORTS {type: "${rel.type}"}]->(to)`
            );
          }
        }
      }
      statements.push('');
    }

    return statements.join('\n');
  }
}

