import { readFile } from 'fs/promises';
import { join, dirname } from 'path';

/**
 * Parsed gitignore pattern with metadata
 */
export interface GitIgnorePattern {
  /** Original pattern from .gitignore */
  original: string;

  /** Converted regex pattern */
  regex: RegExp;

  /** Whether this is a negation pattern (starts with !) */
  negation: boolean;

  /** Whether this matches directories only (ends with /) */
  directoryOnly: boolean;

  /** Source file this pattern came from */
  source: string;
}

/**
 * Parses .gitignore files and provides ignore matching
 */
export class GitIgnoreParser {
  private patterns: GitIgnorePattern[] = [];

  /**
   * Load and parse .gitignore file
   */
  async loadFromFile(gitignorePath: string): Promise<void> {
    try {
      const content = await readFile(gitignorePath, 'utf-8');
      this.parseContent(content, gitignorePath);
    } catch {
      // File doesn't exist or can't be read - ignore silently
      console.warn(`Could not read .gitignore: ${gitignorePath}`);
    }
  }

  /**
   * Load .gitignore from directory (looks for .gitignore in directory)
   */
  async loadFromDirectory(directory: string): Promise<void> {
    const gitignorePath = join(directory, '.gitignore');
    await this.loadFromFile(gitignorePath);
  }

  /**
   * Load .gitignore files recursively from directory up to root
   */
  async loadCascading(startDirectory: string, stopAt?: string): Promise<void> {
    let currentDir = startDirectory;
    const visited = new Set<string>();

    while (true) {
      // Prevent infinite loops
      if (visited.has(currentDir)) break;
      visited.add(currentDir);

      // Load .gitignore from current directory
      await this.loadFromDirectory(currentDir);

      // Stop at specified directory or root
      if (stopAt && currentDir === stopAt) break;

      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) break; // Reached root
      currentDir = parentDir;
    }
  }

  /**
   * Parse .gitignore content
   */
  private parseContent(content: string, source: string): void {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Parse pattern
      const pattern = this.parsePattern(trimmed, source);
      if (pattern) {
        this.patterns.push(pattern);
      }
    }
  }

  /**
   * Parse a single gitignore pattern
   */
  private parsePattern(pattern: string, source: string): GitIgnorePattern | null {
    // Check for negation
    const negation = pattern.startsWith('!');
    if (negation) {
      pattern = pattern.slice(1);
    }

    // Check for directory-only pattern
    const directoryOnly = pattern.endsWith('/');
    if (directoryOnly) {
      pattern = pattern.slice(0, -1);
    }

    // Convert to regex
    const regex = this.patternToRegex(pattern);

    return {
      original: pattern,
      regex,
      negation,
      directoryOnly,
      source,
    };
  }

  /**
   * Convert gitignore pattern to regex
   */
  private patternToRegex(pattern: string): RegExp {
    const originalPattern = pattern;
    
    // Escape special regex characters except *, ?, [, ]
    let regexPattern = pattern.replace(/[.+^${}()|\\]/g, '\\$&');

    // Replace ** with a placeholder BEFORE processing single *
    regexPattern = regexPattern.replace(/\\\*\\\*/g, '<<<DOUBLESTAR>>>');

    // Handle * (match anything except /)
    regexPattern = regexPattern.replace(/\\\*/g, '[^/]*');

    // Restore ** to match everything including / 
    // Special handling for leading **/
    if (regexPattern.startsWith('<<<DOUBLESTAR>>>/')) {
      regexPattern = regexPattern.replace(/^<<<DOUBLESTAR>>>\//g, '(^|.*/)');
    } else if (regexPattern.startsWith('<<<DOUBLESTAR>>>')) {
      regexPattern = regexPattern.replace(/^<<<DOUBLESTAR>>>/g, '(^|.*)');
    }
    
    // Replace remaining ** (in middle or end of pattern)
    regexPattern = regexPattern.replace(/<<<DOUBLESTAR>>>/g, '.*');

    // Handle ? (match single character)
    regexPattern = regexPattern.replace(/\?/g, '.');

    // If pattern doesn't start with / or **, it can match at any level
    if (!originalPattern.startsWith('/') && !originalPattern.startsWith('**')) {
      regexPattern = '(^|.*/)' + regexPattern;
    } else if (originalPattern.startsWith('/')) {
      // Remove leading / and anchor to start
      regexPattern = '^/?' + regexPattern;
    }

    // Allow matching subdirectories/files
    regexPattern = regexPattern + '($|/)';

    return new RegExp(regexPattern);
  }

  /**
   * Check if a file should be ignored
   */
  shouldIgnore(filePath: string, basePath: string = ''): boolean {
    // Normalize path (convert Windows backslashes to forward slashes)
    let normalizedPath = filePath.replace(/\\/g, '/');

    // If basePath is provided, make path relative
    if (basePath) {
      const normalizedBase = basePath.replace(/\\/g, '/');
      if (normalizedPath.startsWith(normalizedBase)) {
        normalizedPath = normalizedPath.slice(normalizedBase.length);
        if (normalizedPath.startsWith('/')) {
          normalizedPath = normalizedPath.slice(1);
        }
      }
    }

    let ignored = false;

    // Apply patterns in order
    for (const pattern of this.patterns) {
      const matches = pattern.regex.test(normalizedPath);

      if (matches) {
        // Negation pattern
        if (pattern.negation) {
          ignored = false;
        } else {
          ignored = true;
        }
      }
    }

    return ignored;
  }

  /**
   * Get all patterns
   */
  getPatterns(): GitIgnorePattern[] {
    return [...this.patterns];
  }

  /**
   * Clear all patterns
   */
  clear(): void {
    this.patterns = [];
  }

  /**
   * Add custom patterns from array
   */
  addPatterns(patterns: string[], source: string = 'custom'): void {
    for (const pattern of patterns) {
      const parsed = this.parsePattern(pattern, source);
      if (parsed) {
        this.patterns.push(parsed);
      }
    }
  }
}

