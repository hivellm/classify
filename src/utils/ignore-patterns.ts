/**
 * Default ignore patterns for file scanning
 * These patterns exclude common build/dependency directories across multiple languages
 */
export const DEFAULT_IGNORE_PATTERNS = [
  // Node.js / JavaScript / TypeScript
  '**/node_modules/**',
  '**/bower_components/**',
  '**/.next/**',
  '**/.nuxt/**',
  
  // Build outputs (general)
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/.output/**',
  
  // Rust
  '**/target/**',
  
  // Java / Kotlin / Scala
  '**/target/**',
  '**/.gradle/**',
  '**/gradle/**',
  '**/.idea/**',
  '**/.mvn/**',
  '**/bin/**',
  '**/*.class',
  
  // C# / .NET
  '**/bin/**',
  '**/obj/**',
  '**/.vs/**',
  '**/packages/**',
  
  // C / C++
  '**/cmake-build-*/**',
  '**/*.o',
  '**/*.obj',
  '**/*.exe',
  '**/*.out',
  '**/*.so',
  '**/*.dylib',
  '**/*.dll',
  
  // Go
  '**/vendor/**',
  
  // Elixir / Erlang
  '**/_build/**',
  '**/deps/**',
  '**/.elixir_ls/**',
  '**/.fetch/**',
  '**/erl_crash.dump',
  
  // Python
  '**/__pycache__/**',
  '**/.pytest_cache/**',
  '**/venv/**',
  '**/env/**',
  '**/.venv/**',
  '**/.env/**',
  '**/*.pyc',
  '**/*.pyo',
  '**/*.egg-info/**',
  
  // Ruby
  '**/vendor/bundle/**',
  '**/.bundle/**',
  
  // PHP
  '**/vendor/**',
  
  // Caches (general)
  '**/cache/**',
  '**/.cache/**',
  '**/coverage/**',
  
  // Temporary files
  '**/tmp/**',
  '**/temp/**',
  '**/logs/**',
  '**/log/**',
  
  // Version control
  '**/.git/**',
  '**/.svn/**',
  '**/.hg/**',
  
  // IDE directories
  '**/.idea/**',
  '**/.vscode/**',
  '**/.vs/**',
  
  // Data directories
  '**/data/**',
] as const;

/**
 * Merge custom ignore patterns with defaults
 */
export function mergeIgnorePatterns(customPatterns: string[] = []): string[] {
  return [...DEFAULT_IGNORE_PATTERNS, ...customPatterns];
}

/**
 * Check if a file path matches any ignore pattern
 */
export function shouldIgnore(filePath: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const regex = new RegExp(
      pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '.')
    );
    return regex.test(filePath);
  });
}

