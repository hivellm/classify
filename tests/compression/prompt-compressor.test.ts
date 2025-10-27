import { describe, it, expect } from 'vitest';
import { PromptCompressor } from '../../src/compression/prompt-compressor.js';

describe('PromptCompressor', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const compressor = new PromptCompressor();
      expect(compressor.isEnabled()).toBe(true);
    });

    it('should create instance with custom options', () => {
      const compressor = new PromptCompressor({
        enabled: false,
        targetRatio: 0.7,
      });
      expect(compressor.isEnabled()).toBe(false);
    });
  });

  describe('compress', () => {
    it('should compress text', () => {
      const compressor = new PromptCompressor({ enabled: true });
      const text =
        'This is a test document with some content that should be compressed to save tokens.';

      const result = compressor.compress(text);

      expect(result.original).toBe(text);
      expect(result.compressed).toBeDefined();
      expect(result.originalTokens).toBeGreaterThan(0);
      expect(result.compressionRatio).toBeGreaterThanOrEqual(0);
      expect(result.compressionRatio).toBeLessThanOrEqual(1);
    });

    it('should return original when compression disabled', () => {
      const compressor = new PromptCompressor({ enabled: false });
      const text = 'Test text';

      const result = compressor.compress(text);

      expect(result.compressed).toBe(text);
      expect(result.compressionRatio).toBe(1.0);
      expect(result.tokenReduction).toBe(0);
      expect(result.compressionTimeMs).toBe(0);
    });

    it('should handle short text', () => {
      const compressor = new PromptCompressor({ enabled: true });
      const text = 'Short';

      const result = compressor.compress(text);

      expect(result).toBeDefined();
      expect(result.compressed).toBeDefined();
    });

    it('should track compression metrics', () => {
      const compressor = new PromptCompressor({ enabled: true });
      const text = `
        This is a longer text that should definitely trigger compression.
        It contains multiple sentences and should result in measurable token reduction.
        The compression algorithm will analyze the statistical importance of each word.
        Words with lower importance scores will be removed to achieve the target compression ratio.
      `;

      const result = compressor.compress(text);

      expect(result.originalTokens).toBeGreaterThan(0);
      expect(result.compressedTokens).toBeGreaterThan(0);
      expect(result.compressionTimeMs).toBeGreaterThanOrEqual(0);
      expect(result.tokenReduction).toBeGreaterThanOrEqual(0);
      expect(result.tokenReduction).toBeLessThanOrEqual(100);
    });
  });

  describe('isEnabled', () => {
    it('should return true when enabled', () => {
      const compressor = new PromptCompressor({ enabled: true });
      expect(compressor.isEnabled()).toBe(true);
    });

    it('should return false when disabled', () => {
      const compressor = new PromptCompressor({ enabled: false });
      expect(compressor.isEnabled()).toBe(false);
    });
  });
});
