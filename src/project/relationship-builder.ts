import { readFile } from 'fs/promises';
import { dirname, join, relative, resolve, extname, basename } from 'path';

/**
 * File relationship (import/dependency)
 */
export interface FileRelationship {
  /** Source file that imports */
  from: string;

  /** Target file being imported */
  to: string;

  /** Import type */
  type: 'import' | 'require' | 'use' | 'mod' | 'include';

  /** Imported symbols (if available) */
  symbols?: string[];

  /** Whether this is a relative import */
  isRelative: boolean;

  /** Whether this is an external package */
  isExternal: boolean;
}

/**
 * Import statement parser for multiple languages
 */
export class RelationshipBuilder {
  private relationships: FileRelationship[] = [];
  private fileCache = new Map<string, string>();

  /**
   * Analyze a file and extract its imports
   */
  async analyzeFile(filePath: string, projectRoot: string): Promise<FileRelationship[]> {
    const content = await this.readFile(filePath);
    const ext = extname(filePath);

    let imports: FileRelationship[] = [];

    switch (ext) {
      case '.ts':
      case '.tsx':
      case '.js':
      case '.jsx':
      case '.mjs':
      case '.cjs':
        imports = this.parseTypeScriptImports(filePath, content, projectRoot);
        break;

      case '.py':
        imports = this.parsePythonImports(filePath, content, projectRoot);
        break;

      case '.rs':
        imports = this.parseRustImports(filePath, content, projectRoot);
        break;

      case '.java':
        imports = this.parseJavaImports(filePath, content, projectRoot);
        break;

      case '.go':
        imports = this.parseGoImports(filePath, content, projectRoot);
        break;

      default:
        // Unsupported file type
        break;
    }

    this.relationships.push(...imports);
    return imports;
  }

  /**
   * Parse TypeScript/JavaScript imports
   */
  private parseTypeScriptImports(
    filePath: string,
    content: string,
    projectRoot: string
  ): FileRelationship[] {
    const imports: FileRelationship[] = [];

    // Match ES6 imports: import ... from '...'
    const es6ImportRegex = /import\s+(?:(?:\{[^}]*\})|(?:\*\s+as\s+\w+)|(?:\w+))\s+from\s+['"]([^'"]+)['"]/g;
    
    // Match dynamic imports: import('...')
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    
    // Match require: require('...')
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    
    // Match export from: export ... from '...'
    const exportFromRegex = /export\s+(?:\{[^}]*\}|\*)\s+from\s+['"]([^'"]+)['"]/g;

    // ES6 imports
    let match;
    while ((match = es6ImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(this.createRelationship(filePath, importPath, 'import', projectRoot));
    }

    // Dynamic imports
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(this.createRelationship(filePath, importPath, 'import', projectRoot));
    }

    // Require calls
    while ((match = requireRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(this.createRelationship(filePath, importPath, 'require', projectRoot));
    }

    // Export from
    while ((match = exportFromRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(this.createRelationship(filePath, importPath, 'import', projectRoot));
    }

    return imports;
  }

  /**
   * Parse Python imports
   */
  private parsePythonImports(
    filePath: string,
    content: string,
    projectRoot: string
  ): FileRelationship[] {
    const imports: FileRelationship[] = [];

    // Match: import module
    const importRegex = /^import\s+([\w.]+)/gm;
    
    // Match: from module import ...
    const fromImportRegex = /^from\s+([\w.]+)\s+import\s+/gm;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const module = match[1];
      imports.push(this.createRelationship(filePath, module, 'import', projectRoot, '.py'));
    }

    while ((match = fromImportRegex.exec(content)) !== null) {
      const module = match[1];
      imports.push(this.createRelationship(filePath, module, 'import', projectRoot, '.py'));
    }

    return imports;
  }

  /**
   * Parse Rust imports
   */
  private parseRustImports(
    filePath: string,
    content: string,
    projectRoot: string
  ): FileRelationship[] {
    const imports: FileRelationship[] = [];

    // Match: use crate::module::...
    const useRegex = /^use\s+(?:crate::)?([^;{]+)/gm;
    
    // Match: mod module;
    const modRegex = /^mod\s+(\w+)\s*;/gm;

    let match;
    while ((match = useRegex.exec(content)) !== null) {
      const module = match[1].trim();
      imports.push(this.createRelationship(filePath, module, 'use', projectRoot, '.rs'));
    }

    while ((match = modRegex.exec(content)) !== null) {
      const module = match[1];
      imports.push(this.createRelationship(filePath, module, 'mod', projectRoot, '.rs'));
    }

    return imports;
  }

  /**
   * Parse Java imports
   */
  private parseJavaImports(
    filePath: string,
    content: string,
    projectRoot: string
  ): FileRelationship[] {
    const imports: FileRelationship[] = [];

    // Match: import package.Class;
    const importRegex = /^import\s+(?:static\s+)?([\w.]+);/gm;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(this.createRelationship(filePath, importPath, 'import', projectRoot, '.java'));
    }

    return imports;
  }

  /**
   * Parse Go imports
   */
  private parseGoImports(
    filePath: string,
    content: string,
    projectRoot: string
  ): FileRelationship[] {
    const imports: FileRelationship[] = [];

    // Match: import "package"
    const singleImportRegex = /^import\s+"([^"]+)"/gm;
    
    // Match: import ( ... )
    const blockImportRegex = /import\s*\(\s*([^)]+)\)/gs;

    let match;
    while ((match = singleImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(this.createRelationship(filePath, importPath, 'import', projectRoot, '.go'));
    }

    while ((match = blockImportRegex.exec(content)) !== null) {
      const block = match[1];
      const lines = block.split('\n');
      
      for (const line of lines) {
        const lineMatch = line.match(/"([^"]+)"/);
        if (lineMatch) {
          const importPath = lineMatch[1];
          imports.push(this.createRelationship(filePath, importPath, 'import', projectRoot, '.go'));
        }
      }
    }

    return imports;
  }

  /**
   * Create a relationship object
   */
  private createRelationship(
    from: string,
    importPath: string,
    type: FileRelationship['type'],
    projectRoot: string,
    defaultExt?: string
  ): FileRelationship {
    const isRelative = importPath.startsWith('.') || importPath.startsWith('/');
    const isExternal = !isRelative;

    let to = importPath;

    // Resolve relative imports
    if (isRelative) {
      const fromDir = dirname(from);
      to = resolve(fromDir, importPath);

      // Add extension if needed
      if (defaultExt && !extname(to)) {
        to = to + defaultExt;
      }

      // Make relative to project root
      to = relative(projectRoot, to);
    }

    return {
      from: relative(projectRoot, from),
      to,
      type,
      isRelative,
      isExternal,
    };
  }

  /**
   * Read file content (with caching)
   */
  private async readFile(filePath: string): Promise<string> {
    if (this.fileCache.has(filePath)) {
      return this.fileCache.get(filePath)!;
    }

    const content = await readFile(filePath, 'utf-8');
    this.fileCache.set(filePath, content);
    return content;
  }

  /**
   * Get all relationships
   */
  getRelationships(): FileRelationship[] {
    return [...this.relationships];
  }

  /**
   * Get relationships for a specific file
   */
  getRelationshipsFor(filePath: string, projectRoot: string): FileRelationship[] {
    const normalizedPath = relative(projectRoot, filePath).replace(/\\/g, '/');
    return this.relationships.filter(r => r.from.replace(/\\/g, '/') === normalizedPath);
  }

  /**
   * Build dependency graph
   */
  buildGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();

    for (const rel of this.relationships) {
      if (!graph.has(rel.from)) {
        graph.set(rel.from, []);
      }
      graph.get(rel.from)!.push(rel.to);
    }

    return graph;
  }

  /**
   * Detect circular dependencies
   */
  detectCircularDependencies(): string[][] {
    const graph = this.buildGraph();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[][] = [];
    const allNodes = new Set<string>();

    // Collect all nodes (both from and to)
    for (const rel of this.relationships) {
      if (!rel.isExternal) {
        allNodes.add(rel.from);
        allNodes.add(rel.to);
      }
    }

    const dfs = (node: string, path: string[]): void => {
      if (recursionStack.has(node)) {
        // Found a cycle
        const cycleStart = path.indexOf(node);
        if (cycleStart !== -1) {
          const cycle = [...path.slice(cycleStart), node];
          cycles.push(cycle);
        }
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      
      for (const neighbor of neighbors) {
        dfs(neighbor, [...path]);
      }

      recursionStack.delete(node);
    };

    for (const node of allNodes) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.relationships = [];
    this.fileCache.clear();
  }
}

