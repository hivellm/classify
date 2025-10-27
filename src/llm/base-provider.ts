import type {
  LLMProvider,
  LLMProviderConfig,
  LLMCompletionRequest,
  LLMCompletionResponse,
} from './types.js';

/**
 * Base LLM Provider with retry logic and error handling
 */
export abstract class BaseLLMProvider implements LLMProvider {
  abstract readonly name: string;
  abstract readonly defaultModel: string;
  abstract readonly supportedModels: string[];

  protected config: Required<LLMProviderConfig>;

  constructor(config: LLMProviderConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model,
      baseUrl: config.baseUrl ?? this.getDefaultBaseUrl(),
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
    };

    if (!this.config.apiKey) {
      throw new Error(`API key required for provider`);
    }
  }

  /**
   * Get default base URL for the provider
   */
  protected abstract getDefaultBaseUrl(): string;

  /**
   * Complete a prompt with retry logic
   */
  async complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        return await this.makeRequest(request);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on client errors (4xx)
        if (this.isClientError(error)) {
          throw lastError;
        }

        // Exponential backoff: 1s, 2s, 4s
        if (attempt < this.config.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Failed after ${this.config.maxRetries} retries: ${lastError?.message}`);
  }

  /**
   * Make the actual API request (implemented by each provider)
   */
  protected abstract makeRequest(_request: LLMCompletionRequest): Promise<LLMCompletionResponse>;

  /**
   * Get model pricing (per 1M tokens)
   */
  abstract getPricing(_model: string): { input: number; output: number };

  /**
   * Check if error is a client error (don't retry)
   */
  protected isClientError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      return status >= 400 && status < 500;
    }
    return false;
  }

  /**
   * Sleep for specified milliseconds
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calculate cost based on token usage and pricing
   */
  protected calculateCost(inputTokens: number, outputTokens: number, model: string): number {
    const pricing = this.getPricing(model);
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    return inputCost + outputCost;
  }
}
