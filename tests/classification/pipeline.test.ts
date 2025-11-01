import { describe, it, expect, vi } from 'vitest';
import { ClassificationPipeline } from '../../src/classification/pipeline.js';
import type { LLMProvider } from '../../src/llm/types.js';
import type { ProcessedDocument } from '../../src/preprocessing/document-processor.js';
import type { ClassificationTemplate } from '../../src/templates/template-loader.js';

describe('ClassificationPipeline', () => {
  const mockDocument: ProcessedDocument = {
    filePath: 'test.md',
    markdown: '# Test\nJohn Doe works at TechCorp.',
    hash: 'test-hash',
    metadata: {
      format: 'markdown',
      fileSize: 100,
      processingTimeMs: 10,
    },
  };

  const mockTemplate: ClassificationTemplate = {
    metadata: {
      name: 'test-template',
      version: '1.0.0',
      description: 'Test',
      domains: ['engineering'],
      doc_types: ['specification'],
    },
    llm_config: {
      system_prompt: 'Extract entities',
      temperature: 0.3,
    },
    entity_definitions: [
      {
        type: 'Person',
        description: 'A person',
        properties: [{ name: 'name', type: 'string', required: true }],
      },
    ],
    relationship_definitions: [],
    classification_fields: {
      title: { type: 'string', required: true },
      doc_type: { type: 'string', required: true },
    },
    examples: [],
  };

  const mockProvider: LLMProvider = {
    name: 'mock',
    defaultModel: 'test',
    complete: vi.fn().mockResolvedValue({
      content: JSON.stringify({
        title: 'Test Doc',
        doc_type: 'specification',
        entities: [{ type: 'Person', properties: { name: 'John Doe' } }],
        relationships: [],
      }),
      finishReason: 'stop',
      usage: { inputTokens: 100, outputTokens: 50 },
      model: 'test',
    }),
  } as unknown as LLMProvider;

  describe('classify', () => {
    it('should classify document and extract entities', async () => {
      const pipeline = new ClassificationPipeline(mockProvider);
      const result = await pipeline.classify(mockDocument, mockTemplate);

      expect(result).toBeDefined();
      expect(result.entities).toHaveLength(1);
      expect(result.entities[0].type).toBe('Person');
      expect(result.classification.title).toBe('Test Doc');
      expect(result.tokens.extraction.input).toBe(100);
      expect(result.tokens.extraction.output).toBe(50);
    });

    it('should handle compression', async () => {
      const pipeline = new ClassificationPipeline(mockProvider, {
        compressionEnabled: true,
        compressionRatio: 0.5,
      });

      const longDoc = {
        ...mockDocument,
        markdown: '# Long\n' + 'Content. '.repeat(200),
      };

      const result = await pipeline.classify(longDoc, mockTemplate);
      expect(result).toBeDefined();
      expect(result.compression).toBeDefined();
    });

    it('should handle missing entities', async () => {
      const noEntitiesProvider = {
        name: 'no-entities',
        defaultModel: 'test',
        complete: vi.fn().mockResolvedValue({
          content: JSON.stringify({
            title: 'Test',
            doc_type: 'test',
            relationships: [],
          }),
          finishReason: 'stop',
          usage: { inputTokens: 10, outputTokens: 5 },
          model: 'test',
        }),
      } as unknown as LLMProvider;

      const pipeline = new ClassificationPipeline(noEntitiesProvider);
      const result = await pipeline.classify(mockDocument, mockTemplate);

      expect(result.entities).toEqual([]);
    });

    it('should handle missing relationships', async () => {
      const noRelsProvider = {
        name: 'no-rels',
        defaultModel: 'test',
        complete: vi.fn().mockResolvedValue({
          content: JSON.stringify({
            title: 'Test',
            doc_type: 'test',
            entities: [{ type: 'Person', properties: { name: 'John' } }],
          }),
          finishReason: 'stop',
          usage: { inputTokens: 10, outputTokens: 5 },
          model: 'test',
        }),
      } as unknown as LLMProvider;

      const pipeline = new ClassificationPipeline(noRelsProvider);
      const result = await pipeline.classify(mockDocument, mockTemplate);

      expect(result.relationships).toEqual([]);
    });

    it('should throw on invalid JSON', async () => {
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

      const pipeline = new ClassificationPipeline(invalidProvider);
      await expect(pipeline.classify(mockDocument, mockTemplate)).rejects.toThrow();
    });

    it('should truncate long documents', async () => {
      const pipeline = new ClassificationPipeline(mockProvider);
      const veryLongDoc = {
        ...mockDocument,
        markdown: 'x'.repeat(15000),
      };

      const result = await pipeline.classify(veryLongDoc, mockTemplate);
      expect(result).toBeDefined();
    });
  });

  describe('buildExtractionMessages', () => {
    it('should build extraction messages', () => {
      const pipeline = new ClassificationPipeline(mockProvider);
      const messages = (pipeline as any).buildExtractionMessages(mockDocument, mockTemplate);

      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
      expect(messages[1].content).toContain('JSON');
    });
  });
});
