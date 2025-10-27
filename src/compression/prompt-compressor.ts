import { Compressor as CompressionPromptCompressor } from '@hivellm/compression-prompt';

/**
 * Compression result
 */
export interface CompressionResult {
  /** Original text */
  original: string;

  /** Compressed text */
  compressed: string;

  /** Original token count */
  originalTokens: number;

  /** Compressed token count */
  compressedTokens: number;

  /** Compression ratio (0-1) */
  compressionRatio: number;

  /** Token reduction percentage */
  tokenReduction: number;

  /** Compression time in ms */
  compressionTimeMs: number;
}

/**
 * Prompt Compressor
 * Uses @hivellm/compression-prompt to reduce token count by 50% while maintaining 91% quality
 */
export class PromptCompressor {
  private enabled: boolean;
  private compressor: CompressionPromptCompressor;

  constructor(options: { enabled?: boolean; targetRatio?: number } = {}) {
    this.enabled = options.enabled ?? true;
    const targetRatio = options.targetRatio ?? 0.5; // 50% compression by default

    // Initialize compression-prompt compressor
    this.compressor = new CompressionPromptCompressor({
      targetRatio,
      minInputTokens: 50, // Compress texts larger than 50 tokens
      minInputBytes: 200, // Compress texts larger than 200 bytes
    });
  }

  /**
   * Compress text using compression-prompt
   * @param text - Text to compress
   * @returns Compression result
   */
  compress(text: string): CompressionResult {
    if (!this.enabled) {
      // If compression disabled, return original
      const tokens = this.estimateTokens(text);
      return {
        original: text,
        compressed: text,
        originalTokens: tokens,
        compressedTokens: tokens,
        compressionRatio: 1.0,
        tokenReduction: 0,
        compressionTimeMs: 0,
      };
    }

    const startTime = Date.now();

    try {
      // Use compression-prompt library
      const result = this.compressor.compress(text);

      const compressionTimeMs = Date.now() - startTime;

      return {
        original: text,
        compressed: result.compressed,
        originalTokens: result.originalTokens,
        compressedTokens: result.compressedTokens,
        compressionRatio: result.compressionRatio,
        tokenReduction:
          ((result.originalTokens - result.compressedTokens) /
            result.originalTokens) *
          100,
        compressionTimeMs,
      };
    } catch (error) {
      // If compression fails, return original
      console.warn(
        `Compression failed, using original text: ${error instanceof Error ? error.message : 'Unknown error'}`
      );

      const tokens = this.estimateTokens(text);
      return {
        original: text,
        compressed: text,
        originalTokens: tokens,
        compressedTokens: tokens,
        compressionRatio: 1.0,
        tokenReduction: 0,
        compressionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Estimate token count (rough approximation: 1 token ≈ 4 chars)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if compression is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}


