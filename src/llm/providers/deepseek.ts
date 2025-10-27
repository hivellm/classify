import { BaseLLMProvider } from '../base-provider.js';
import type { LLMCompletionRequest, LLMCompletionResponse } from '../types.js';

/**
 * DeepSeek LLM Provider
 * API compatible with OpenAI
 * Pricing: $0.14 input / $0.28 output per 1M tokens
 */
export class DeepSeekProvider extends BaseLLMProvider {
  readonly name = 'deepseek';
  readonly defaultModel = 'deepseek-chat';
  readonly supportedModels = ['deepseek-chat', 'deepseek-reasoner'];

  protected getDefaultBaseUrl(): string {
    return 'https://api.deepseek.com/v1';
  }

  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const model = request.model || this.defaultModel;

    if (!this.supportedModels.includes(model)) {
      throw new Error(
        `Model ${model} not supported. Use one of: ${this.supportedModels.join(', ')}`
      );
    }

    const requestBody = {
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
      ...(request.jsonMode && { response_format: { type: 'json_object' } }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw Object.assign(new Error(`DeepSeek API error (${response.status}): ${error}`), {
          status: response.status,
        });
      }

      const data = (await response.json()) as {
        choices: Array<{
          message: { content: string };
          finish_reason: string;
        }>;
        usage: {
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
        };
        model: string;
      };

      const choice = data.choices[0];
      if (!choice?.message) {
        throw new Error('Invalid API response: missing choice or message');
      }

      const usage = {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      };

      return {
        content: choice.message.content,
        usage,
        costUsd: this.calculateCost(usage.inputTokens, usage.outputTokens, model),
        model: data.model,
        finishReason: this.mapFinishReason(choice.finish_reason),
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  getPricing(_model: string): { input: number; output: number } {
    // DeepSeek pricing: $0.14 input / $0.28 output per 1M tokens
    // Same pricing for all models
    return {
      input: 0.14,
      output: 0.28,
    };
  }

  private mapFinishReason(reason: string): 'stop' | 'length' | 'content_filter' | 'error' {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'content_filter':
        return 'content_filter';
      default:
        return 'error';
    }
  }
}
