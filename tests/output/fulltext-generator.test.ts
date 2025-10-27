import { describe, it, expect } from 'vitest';
import { FulltextGenerator } from '../../src/output/fulltext-generator.js';
import { DeepSeekProvider } from '../../src/llm/providers/deepseek.js';
import type { ProcessedDocument } from '../../src/preprocessing/document-processor.js';
import type { ClassificationPipelineResult } from '../../src/classification/pipeline.js';

describe('FulltextGenerator', () => {
  const mockProvider = new DeepSeekProvider({
    apiKey: 'test-key',
    model: 'deepseek-chat',
  });

  const generator = new FulltextGenerator(mockProvider);

  const mockDocument: ProcessedDocument = {
    filePath: 'test.md',
    markdown: 'This is a test document about software development and testing.',
    hash: 'test-hash-123',
    metadata: {
      format: 'markdown',
      fileSize: 100,
      processingTimeMs: 0,
    },
  };

  const mockClassification: ClassificationPipelineResult = {
    template: {} as any,
    confidence: 0.95,
    entities: [
      {
        type: 'Person',
        properties: { name: 'John Doe', role: 'Developer' },
      },
      {
        type: 'Organization',
        properties: { name: 'TechCorp' },
      },
      {
        type: 'Date',
        properties: { date: '2025-01-01' },
      },
    ],
    relationships: [],
    classification: {
      domain: 'engineering',
      docType: 'specification',
      title: 'Test Document',
    },
    tokens: {
      selection: { input: 0, output: 0 },
      extraction: { input: 100, output: 50 },
      total: 150,
    },
    costUsd: 0.001,
  };

  describe('generate', () => {
    it.skip('should generate fulltext metadata (requires API key)', async () => {
      // Requires real API key - skip in CI
      const result = await generator.generate(mockDocument, mockClassification);

      expect(result.title).toBeDefined();
      expect(result.domain).toBeDefined();
      expect(result.docType).toBeDefined();
      expect(Array.isArray(result.keywords)).toBe(true);
    });

    it('should instantiate generator', () => {
      expect(generator).toBeDefined();
    });
  });
});
