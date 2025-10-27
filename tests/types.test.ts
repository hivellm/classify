import { describe, it, expect } from 'vitest';
import type { ClassifyOptions, ClassifyResult } from '../src/types.js';

describe('Types', () => {
  describe('ClassifyOptions', () => {
    it('should accept all valid providers', (): void => {
      const validProviders: Array<ClassifyOptions['provider']> = [
        'deepseek',
        'openai',
        'anthropic',
        'gemini',
        'xai',
        'groq',
      ];

      validProviders.forEach((provider) => {
        const options: ClassifyOptions = { provider };
        expect(options.provider).toBe(provider);
      });
    });

    it('should accept partial options', (): void => {
      const options: ClassifyOptions = {
        model: 'deepseek-chat',
      };
      expect(options.model).toBe('deepseek-chat');
    });

    it('should accept full options', (): void => {
      const options: ClassifyOptions = {
        provider: 'deepseek',
        model: 'deepseek-chat',
        apiKey: 'test-key',
        cacheEnabled: true,
        cacheDir: '.cache',
        compressionEnabled: true,
        compressionRatio: 0.5,
      };
      expect(options).toBeDefined();
    });
  });

  describe('ClassifyResult', () => {
    it('should have all required fields', (): void => {
      const result: ClassifyResult = {
        classification: {
          template: 'legal',
          confidence: 0.95,
          domain: 'legal',
          docType: 'contract',
        },
        graphStructure: {
          cypher: 'CREATE (n:Document)',
          entities: [],
          relationships: [],
        },
        fulltextMetadata: {
          title: 'Test Document',
          domain: 'legal',
          docType: 'contract',
          extractedFields: {},
          keywords: ['contract', 'legal'],
        },
        cacheInfo: {
          cached: false,
          hash: 'abc123',
        },
        performance: {
          totalTimeMs: 1000,
        },
      };

      expect(result.classification.template).toBe('legal');
      expect(result.classification.confidence).toBe(0.95);
      expect(result.graphStructure.cypher).toBeDefined();
      expect(result.fulltextMetadata.title).toBeDefined();
      expect(result.cacheInfo.hash).toBeDefined();
      expect(result.performance.totalTimeMs).toBeGreaterThan(0);
    });

    it('should allow optional performance fields', (): void => {
      const result: ClassifyResult = {
        classification: {
          template: 'financial',
          confidence: 0.88,
          domain: 'finance',
          docType: 'invoice',
        },
        graphStructure: {
          cypher: 'CREATE (n:Document)',
          entities: [],
          relationships: [],
        },
        fulltextMetadata: {
          title: 'Invoice',
          domain: 'finance',
          docType: 'invoice',
          extractedFields: {},
          keywords: [],
          summary: 'A financial invoice document',
        },
        cacheInfo: {
          cached: true,
          hash: 'def456',
        },
        performance: {
          totalTimeMs: 5,
          tokens: {
            input: 1000,
            output: 500,
            total: 1500,
          },
          costUsd: 0.0024,
        },
      };

      expect(result.performance.tokens).toBeDefined();
      expect(result.performance.costUsd).toBe(0.0024);
      expect(result.fulltextMetadata.summary).toBeDefined();
    });
  });
});

