import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateSelector } from '../../src/templates/template-selector.js';
import { TemplateLoader } from '../../src/templates/template-loader.js';
import type { LLMProvider } from '../../src/llm/types.js';

describe('TemplateSelector', () => {
  let templateLoader: TemplateLoader;
  let mockProvider: LLMProvider;

  beforeEach(async () => {
    templateLoader = new TemplateLoader();
    await templateLoader.loadTemplates();

    mockProvider = {
      name: 'mock-provider',
      defaultModel: 'mock-model',
      complete: vi.fn().mockResolvedValue({
        content: JSON.stringify({
          template_id: 'base',
          confidence: 0.95,
          reasoning: 'Best match for general content',
        }),
        finishReason: 'stop',
        usage: { inputTokens: 100, outputTokens: 50 },
        model: 'mock-model',
      }),
    } as unknown as LLMProvider;
  });

  describe('select', () => {
    it('should select template based on document content', async () => {
      const selector = new TemplateSelector(mockProvider, templateLoader);
      const result = await selector.select('# Test Document\nThis is a test.');

      expect(result).toBeDefined();
      expect(result.templateId).toBe('base');
      expect(result.confidence).toBe(0.95);
      expect(result.reasoning).toBeDefined();
      expect(result.tokens.input).toBe(100);
      expect(result.tokens.output).toBe(50);
      expect(mockProvider.complete).toHaveBeenCalled();
    });

    it('should handle compression', async () => {
      const selector = new TemplateSelector(mockProvider, templateLoader, {
        compressionEnabled: true,
        compressionRatio: 0.5,
      });

      const longDoc = '# Long Document\n' + 'Content. '.repeat(200);
      const result = await selector.select(longDoc);

      expect(result).toBeDefined();
      expect(result.compression).toBeDefined();
    });

    it('should throw error when LLM returns invalid JSON', async () => {
      const invalidProvider = {
        name: 'invalid',
        defaultModel: 'test',
        complete: vi.fn().mockResolvedValue({
          content: 'not json',
          finishReason: 'stop',
          usage: { inputTokens: 10, outputTokens: 5 },
          model: 'test',
        }),
      } as unknown as LLMProvider;

      const selector = new TemplateSelector(invalidProvider, templateLoader);
      await expect(selector.select('test')).rejects.toThrow();
    });

    it('should throw error for non-existent template', async () => {
      const badProvider = {
        name: 'bad',
        defaultModel: 'test',
        complete: vi.fn().mockResolvedValue({
          content: JSON.stringify({
            template_id: 'non-existent',
            confidence: 0.5,
            reasoning: 'test',
          }),
          finishReason: 'stop',
          usage: { inputTokens: 10, outputTokens: 5 },
          model: 'test',
        }),
      } as unknown as LLMProvider;

      const selector = new TemplateSelector(badProvider, templateLoader);
      await expect(selector.select('test')).rejects.toThrow(/invalid template/);
    });

    it('should truncate long documents', async () => {
      const selector = new TemplateSelector(mockProvider, templateLoader);
      const veryLongDoc = 'x'.repeat(5000);

      const result = await selector.select(veryLongDoc);
      expect(result).toBeDefined();
    });
  });

  describe('buildSelectionPrompt', () => {
    it('should build prompt with template index', async () => {
      const selector = new TemplateSelector(mockProvider, templateLoader);
      const index = templateLoader.getIndex();

      // Access private method through bracket notation
      const prompt = (selector as any).buildSelectionPrompt(index, 'test content');

      expect(prompt.system).toContain('classification template');
      expect(prompt.system).toContain('base');
    });
  });
});
