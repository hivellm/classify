/**
 * Configuration options for ClassifyClient
 */
export interface ClassifyOptions {
  /** LLM provider (default: 'deepseek') */
  provider?: 'deepseek' | 'openai' | 'anthropic' | 'gemini' | 'xai' | 'groq';

  /** LLM model name */
  model?: string;

  /** API key for the LLM provider */
  apiKey?: string;

  /** Enable caching (default: true) */
  cacheEnabled?: boolean;

  /** Cache directory path (default: '.classify-cache') */
  cacheDir?: string;

  /** Enable prompt compression (default: true) */
  compressionEnabled?: boolean;

  /** Compression ratio 0-1 (default: 0.5 = 50% reduction) */
  compressionRatio?: number;
}

/**
 * Classification result
 */
export interface ClassifyResult {
  /** Document classification details */
  classification: {
    /** Selected template name */
    template: string;

    /** Template selection confidence (0-1) */
    confidence: number;

    /** Document domain */
    domain: string;

    /** Document type */
    docType: string;
  };

  /** Generated graph structure */
  graphStructure: {
    /** Cypher statements */
    cypher: string;

    /** Extracted entities */
    entities: Array<{
      type: string;
      properties: Record<string, unknown>;
    }>;

    /** Extracted relationships */
    relationships: Array<{
      type: string;
      source: string;
      target: string;
      properties: Record<string, unknown>;
    }>;
  };

  /** Generated fulltext metadata */
  fulltextMetadata: {
    /** Document title */
    title: string;

    /** Document domain */
    domain: string;

    /** Document type */
    docType: string;

    /** Extracted fields */
    extractedFields: Record<string, unknown>;

    /** Keywords */
    keywords: string[];

    /** Document summary */
    summary?: string;
  };

  /** Cache information */
  cacheInfo: {
    /** Whether result was from cache */
    cached: boolean;

    /** SHA256 hash of input */
    hash: string;
  };

  /** Performance metrics */
  performance: {
    /** Total processing time in ms */
    totalTimeMs: number;

    /** Token usage */
    tokens?: {
      input: number;
      output: number;
      total: number;
    };

    /** Estimated cost in USD */
    costUsd?: number;
  };
}
