import { readFile, access } from 'fs/promises';
import { join } from 'path';

/**
 * Project type detection result
 */
export interface ProjectInfo {
  /** Project name */
  name: string;

  /** Project type(s) */
  types: ('nodejs' | 'rust' | 'python' | 'java' | 'go' | 'multi-language')[];

  /** Primary language */
  primaryLanguage: string;

  /** Entry points */
  entryPoints: string[];

  /** Configuration files found */
  configFiles: string[];

  /** Project root directory */
  rootDir: string;
}

/**
 * Detects project structure and type
 */
export class ProjectDetector {
  /**
   * Detect project information from directory
   */
  async detect(directory: string): Promise<ProjectInfo> {
    const types: ProjectInfo['types'] = [];
    const configFiles: string[] = [];
    const entryPoints: string[] = [];
    const dirParts = directory.split(/[/\\]/);
    let name: string = dirParts[dirParts.length - 1] ?? 'unknown';
    let primaryLanguage: string = 'unknown';

    // Detect Node.js
    if (await this.fileExists(join(directory, 'package.json'))) {
      types.push('nodejs');
      configFiles.push('package.json');
      primaryLanguage = 'javascript';

      // Check for TypeScript
      if (await this.fileExists(join(directory, 'tsconfig.json'))) {
        configFiles.push('tsconfig.json');
        primaryLanguage = 'typescript';
      }

      // Find entry points
      const pkgContent = await this.readJson(join(directory, 'package.json'));
      name = pkgContent.name ?? name;
      
      if (pkgContent.main) entryPoints.push(pkgContent.main);
      if (pkgContent.module) entryPoints.push(pkgContent.module);
      
      // Common Node.js entry points
      if (await this.fileExists(join(directory, 'src/index.ts'))) entryPoints.push('src/index.ts');
      if (await this.fileExists(join(directory, 'src/index.js'))) entryPoints.push('src/index.js');
      if (await this.fileExists(join(directory, 'index.ts'))) entryPoints.push('index.ts');
      if (await this.fileExists(join(directory, 'index.js'))) entryPoints.push('index.js');
    }

    // Detect Rust
    if (await this.fileExists(join(directory, 'Cargo.toml'))) {
      types.push('rust');
      configFiles.push('Cargo.toml');
      if (!primaryLanguage || primaryLanguage === 'unknown') {
        primaryLanguage = 'rust';
      }

      // Read Cargo.toml for name
      const cargoContent = await readFile(join(directory, 'Cargo.toml'), 'utf-8');
      const nameMatch = cargoContent.match(/name\s*=\s*"([^"]+)"/);
      if (nameMatch?.[1]) name = nameMatch[1];

      // Common Rust entry points
      if (await this.fileExists(join(directory, 'src/lib.rs'))) entryPoints.push('src/lib.rs');
      if (await this.fileExists(join(directory, 'src/main.rs'))) entryPoints.push('src/main.rs');
    }

    // Detect Python
    const pythonConfigs = ['pyproject.toml', 'setup.py', 'requirements.txt'];
    for (const config of pythonConfigs) {
      if (await this.fileExists(join(directory, config))) {
        if (!types.includes('python')) types.push('python');
        configFiles.push(config);
        if (!primaryLanguage || primaryLanguage === 'unknown') {
          primaryLanguage = 'python';
        }
        break;
      }
    }

    if (types.includes('python')) {
      // Common Python entry points
      if (await this.fileExists(join(directory, '__init__.py'))) entryPoints.push('__init__.py');
      if (await this.fileExists(join(directory, 'main.py'))) entryPoints.push('main.py');
      if (await this.fileExists(join(directory, 'src/__init__.py'))) entryPoints.push('src/__init__.py');
    }

    // Multi-language detection
    if (types.length > 1) {
      types.push('multi-language');
    }

    // If no specific type detected, mark as unknown
    if (types.length === 0) {
      primaryLanguage = 'unknown';
    }

    return {
      name,
      types,
      primaryLanguage,
      entryPoints,
      configFiles,
      rootDir: directory,
    };
  }

  /**
   * Check if file exists
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read and parse JSON file
   */
  private async readJson(path: string): Promise<any> {
    try {
      const content = await readFile(path, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
}

