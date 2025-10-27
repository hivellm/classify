/**
 * LLM Provider Types and Interfaces
 */

/**
 * LLM message role
 */
export type LLMRole = 'system' | 'user' | 'assistant';

/**
 * LLM message
 */
export interface LLMMessage {
  role: LLMRole;
  content: string;
}

/**
 * LLM completion request
 */
export interface LLMCompletionRequest {
  /** Messages for the conversation */
  messages: LLMMessage[];

  /** Model to use */
  model: string;

  /** Temperature (0-2, default: 0.7) */
  temperature?: number;

  /** Maximum tokens to generate */
  maxTokens?: number;

  /** JSON mode (force JSON output) */
  jsonMode?: boolean;
}

/**
 * LLM completion response
 */
export interface LLMCompletionResponse {
  /** Generated content */
  content: string;

  /** Token usage */
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };

  /** Estimated cost in USD */
  costUsd: number;

  /** Model used */
  model: string;

  /** Finish reason */
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
}

/**
 * LLM Provider configuration
 */
export interface LLMProviderConfig {
  /** API key */
  apiKey: string;

  /** Default model */
  model: string;

  /** API base URL (optional) */
  baseUrl?: string;

  /** Request timeout in ms (default: 30000) */
  timeout?: number;

  /** Max retries (default: 3) */
  maxRetries?: number;
}

/**
 * LLM Provider interface
 */
export interface LLMProvider {
  /** Provider name */
  readonly name: string;

  /** Default model */
  readonly defaultModel: string;

  /** Supported models */
  readonly supportedModels: string[];

  /**
   * Complete a prompt
   */
  complete(_request: LLMCompletionRequest): Promise<LLMCompletionResponse>;

  /**
   * Get model pricing (per 1M tokens)
   */
  getPricing(_model: string): { input: number; output: number };
}

