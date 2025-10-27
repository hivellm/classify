import type { ClassifyOptions, ClassifyResult } from './types.js';

/**
 * Main client for document classification
 */
export class ClassifyClient {
  private options: Required<ClassifyOptions>;

  constructor(options: ClassifyOptions = {}) {
    // Initialize with defaults, merging provided options
    this.options = {
      provider: options.provider ?? 'deepseek',
      model: options.model ?? 'deepseek-chat',
      apiKey: options.apiKey ?? process.env.DEEPSEEK_API_KEY ?? '',
      cacheEnabled: options.cacheEnabled ?? true,
      cacheDir: options.cacheDir ?? '.classify-cache',
      compressionEnabled: options.compressionEnabled ?? true,
      compressionRatio: options.compressionRatio ?? 0.5,
    };
    
    // Validate API key if provided
    if (this.options.apiKey === '') {
      console.warn('Warning: No API key provided. Set DEEPSEEK_API_KEY or pass apiKey in options.');
    }
  }

  /**
   * Classify a document
   * @param filePath - Path to document file
   * @returns Classification result
   */
  async classify(filePath: string): Promise<ClassifyResult> {
    // TODO: Implement full classification pipeline
    throw new Error(`Not implemented yet. File: ${filePath}`);
  }
}

