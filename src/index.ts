/**
 * Classify CLI - Intelligent document classification for graph databases and full-text search
 * @packageDocumentation
 */

export { ClassifyClient } from './client.js';
export type { ClassifyOptions, ClassifyResult } from './types.js';

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
export {
  DocumentProcessor,
  type ProcessedDocument,
} from './preprocessing/index.js';

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
export {
  PromptCompressor,
  type CompressionResult,
} from './compression/index.js';
