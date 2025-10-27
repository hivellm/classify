/**
 * Classify CLI - Intelligent document classification for graph databases and full-text search
 * @packageDocumentation
 */

export { ClassifyClient } from './client.js';
export type { ClassifyOptions, ClassifyResult, ClassifyFileOptions } from './types.js';

// LLM Providers
export {
  BaseLLMProvider,
  DeepSeekProvider,
  OpenAIProvider,
  ProviderFactory,
  type ProviderName,
  type LLMProvider,
  type LLMMessage,
  type LLMCompletionRequest,
  type LLMCompletionResponse,
} from './llm/index.js';

// Document Processing
export { DocumentProcessor, type ProcessedDocument } from './preprocessing/index.js';

// Templates
export {
  TemplateLoader,
  TemplateSelector,
  type ClassificationTemplate,
  type TemplateIndex,
  type TemplateSelection,
} from './templates/index.js';

// Classification
export {
  ClassificationPipeline,
  type ClassificationPipelineResult,
} from './classification/index.js';

// Compression
export { PromptCompressor, type CompressionResult } from './compression/index.js';

// Output Generation
export { FulltextGenerator, type FulltextMetadata } from './output/index.js';

// Cache System
export { CacheManager, type CacheStats } from './cache/index.js';

// Batch Processing
export { BatchProcessor, type BatchOptions, type BatchResult } from './batch/index.js';

// Utilities
export {
  DEFAULT_IGNORE_PATTERNS,
  mergeIgnorePatterns,
  shouldIgnore,
} from './utils/ignore-patterns.js';

// Integrations
export {
  Neo4jClient,
  ElasticsearchClient,
  type Neo4jConfig,
  type ElasticsearchConfig,
} from './integrations/index.js';
