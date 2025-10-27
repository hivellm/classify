import { readdir, stat } from 'fs/promises';
import { join, relative, extname, basename } from 'path';
import { GitIgnoreParser } from './gitignore-parser.js';
import { shouldIgnore, DEFAULT_IGNORE_PATTERNS } from './ignore-patterns.js';

/**
 * File metadata from scanning
 */
export interface ScannedFile {
  /** Absolute path to file */
  path: string;
  
  /** Path relative to scan root */
  relativePath: string;
  
  /** File size in bytes */
  size: number;
  
  /** File extension (e.g., '.ts') */
  extension: string;
  
  /** Base filename without extension */
  basename: string;
  
  /** File category for sorting */
  category: 'config' | 'entry' | 'module' | 'test' | 'other';
  
  /** Last modified timestamp */
  modified: Date;
}

/**
 * Options for recursive scanning
 */
export interface ScanOptions {
  /** Use .gitignore patterns (default: true) */
  useGitIgnore?: boolean;
  
  /** Include test files (default: false) */
  includeTests?: boolean;
  
  /** Additional patterns to ignore */
  ignorePatterns?: string[];
  
  /** File extensions to include (default: common source files) */
  extensions?: string[];
  
  /** Maximum depth to scan (default: unlimited) */
  maxDepth?: number;
  
  /** Follow symbolic links (default: false) */
  followSymlinks?: boolean;
  
  /** Sort files by category and path (default: true) */
  sort?: boolean;
}

/**
 * Priority order for file categories
 */
const CATEGORY_PRIORITY: Record<ScannedFile['category'], number> = {
  config: 1,
  entry: 2,
  module: 3,
  test: 4,
  other: 5,
};

/**
 * Default source file extensions
 */
const DEFAULT_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.pyi',
  '.rs',
  '.java',
  '.go',
  '.rb',
  '.php',
  '.c', '.cpp', '.cc', '.h', '.hpp',
  '.cs',
  '.ex', '.exs',
  '.md',
  '.json', '.yml', '.yaml', '.toml',
  '.sh', '.bash',
];

/**
 * Recursively scans a directory for source files
 */
export class RecursiveScanner {
  private gitignoreParser?: GitIgnoreParser;
  private ignorePatterns: string[];
  private extensions: Set<string>;
  private includeTests: boolean;
  private maxDepth: number;
  private followSymlinks: boolean;
  private sortResults: boolean;
  
  constructor(options: ScanOptions = {}) {
    this.ignorePatterns = [
      ...DEFAULT_IGNORE_PATTERNS,
      ...(options.ignorePatterns ?? []),
    ];
    
    this.extensions = new Set(
      options.extensions ?? DEFAULT_EXTENSIONS
    );
    
    this.includeTests = options.includeTests ?? false;
    this.maxDepth = options.maxDepth ?? Infinity;
    this.followSymlinks = options.followSymlinks ?? false;
    this.sortResults = options.sort ?? true;
    
    // GitIgnore parser will be initialized during scan
    if (options.useGitIgnore !== false) {
      this.gitignoreParser = new GitIgnoreParser();
    }
  }
  
  /**
   * Scan directory recursively
   */
  async scan(directory: string): Promise<ScannedFile[]> {
    // Check if directory exists
    try {
      await stat(directory);
    } catch {
      throw new Error(`Directory does not exist: ${directory}`);
    }
    
    // Load .gitignore if enabled
    if (this.gitignoreParser) {
      await this.gitignoreParser.loadCascading(directory);
    }
    
    const files: ScannedFile[] = [];
    await this.scanRecursive(directory, directory, 0, files);
    
    // Sort files if requested
    if (this.sortResults) {
      this.sortFiles(files);
    }
    
    return files;
  }
  
  /**
   * Recursive scanning implementation
   */
  private async scanRecursive(
    directory: string,
    rootDir: string,
    depth: number,
    results: ScannedFile[]
  ): Promise<void> {
    // Check depth limit
    if (depth > this.maxDepth) {
      return;
    }
    
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        const relativePath = relative(rootDir, fullPath);
        
        // Apply filters at each level
        if (this.shouldSkipEntry(fullPath, relativePath, entry.name)) {
          continue;
        }
        
        // Handle symbolic links
        if (entry.isSymbolicLink() && !this.followSymlinks) {
          continue;
        }
        
        if (entry.isDirectory()) {
          // Recurse into directory
          await this.scanRecursive(fullPath, rootDir, depth + 1, results);
        } else if (entry.isFile()) {
          // Process file
          const extension = extname(entry.name);
          
          // Check if extension is allowed
          if (!this.extensions.has(extension)) {
            continue;
          }
          
          // Get file stats
          const stats = await stat(fullPath);
          
          // Create file metadata
          const file: ScannedFile = {
            path: fullPath,
            relativePath,
            size: stats.size,
            extension,
            basename: basename(entry.name, extension),
            category: this.categorizeFile(relativePath, entry.name),
            modified: stats.mtime,
          };
          
          results.push(file);
        }
      }
    } catch {
      // Log error but continue scanning
      console.warn(`Warning: Could not scan ${directory}`);
    }
  }
  
  /**
   * Check if entry should be skipped
   */
  private shouldSkipEntry(
    fullPath: string,
    relativePath: string,
    name: string
  ): boolean {
    // Skip hidden files/directories (starting with .)
    if (name.startsWith('.') && name !== '.') {
      return true;
    }
    
    // Check gitignore
    if (this.gitignoreParser?.shouldIgnore(fullPath)) {
      return true;
    }
    
    // Check default ignore patterns
    if (shouldIgnore(fullPath, this.ignorePatterns)) {
      return true;
    }
    
    // Optionally exclude tests
    if (!this.includeTests) {
      const testPatterns = [
        /test/i,
        /spec/i,
        /__tests__/i,
        /__mocks__/i,
        /\.test\./,
        /\.spec\./,
      ];
      
      if (testPatterns.some(pattern => pattern.test(relativePath))) {
        return false; // Let it through for now, will be filtered by extension
      }
    }
    
    return false;
  }
  
  /**
   * Categorize file for sorting
   */
  private categorizeFile(relativePath: string, filename: string): ScannedFile['category'] {
    const lowerPath = relativePath.toLowerCase();
    const lowerName = filename.toLowerCase();
    
    // Configuration files
    const configFiles = [
      'package.json', 'tsconfig.json', 'cargo.toml', 'pyproject.toml',
      'setup.py', 'requirements.txt', 'pom.xml', 'build.gradle',
      'go.mod', 'gemfile', 'composer.json', 'mix.exs',
    ];
    
    if (configFiles.includes(lowerName)) {
      return 'config';
    }
    
    // Entry points
    const entryFiles = [
      'index', 'main', 'app', '__init__', 'lib',
    ];
    
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '').toLowerCase();
    if (entryFiles.includes(nameWithoutExt) && !lowerPath.includes('test')) {
      return 'entry';
    }
    
    // Test files
    if (lowerPath.includes('test') || lowerPath.includes('spec') || 
        lowerPath.includes('__tests__') || lowerPath.includes('__mocks__')) {
      return 'test';
    }
    
    // Module files (in src, lib, or similar) - normalize path separators
    const normalizedPath = lowerPath.replace(/\\/g, '/');
    if (normalizedPath.includes('src/') || normalizedPath.includes('lib/')) {
      return 'module';
    }
    
    return 'other';
  }
  
  /**
   * Sort files by category and path
   */
  private sortFiles(files: ScannedFile[]): void {
    files.sort((a, b) => {
      // First by category
      const categoryDiff = CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category];
      if (categoryDiff !== 0) {
        return categoryDiff;
      }
      
      // Then by path depth (shallower first)
      const aDepth = a.relativePath.split(/[/\\]/).length;
      const bDepth = b.relativePath.split(/[/\\]/).length;
      if (aDepth !== bDepth) {
        return aDepth - bDepth;
      }
      
      // Finally by path alphabetically
      return a.relativePath.localeCompare(b.relativePath);
    });
  }
  
  /**
   * Get statistics about scanned files
   */
  static getStatistics(files: ScannedFile[]): {
    totalFiles: number;
    totalSize: number;
    byCategory: Record<ScannedFile['category'], number>;
    byExtension: Record<string, number>;
    averageSize: number;
  } {
    let totalSize = 0;
    const byCategory: Record<string, number> = {};
    const byExtension: Record<string, number> = {};
    
    for (const file of files) {
      totalSize += file.size;
      byCategory[file.category] = (byCategory[file.category] ?? 0) + 1;
      byExtension[file.extension] = (byExtension[file.extension] ?? 0) + 1;
    }
    
    return {
      totalFiles: files.length,
      totalSize,
      byCategory: byCategory as Record<ScannedFile['category'], number>,
      byExtension,
      averageSize: files.length > 0 ? totalSize / files.length : 0,
    };
  }
}

