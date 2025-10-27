import { BaseLLMProvider } from '../base-provider.js';
import type { LLMCompletionRequest, LLMCompletionResponse } from '../types.js';

/**
 * OpenAI LLM Provider
 * Pricing varies by model
 */
export class OpenAIProvider extends BaseLLMProvider {
  readonly name = 'openai';
  readonly defaultModel = 'gpt-5-mini';
  readonly supportedModels = [
    'gpt-5-mini',
    'gpt-5-nano',
    'gpt-4o-2024-11-20',
    'gpt-4o-2024-08-06',
    'gpt-4o-2024-05-13',
    'gpt-4o-mini-2024-07-18',
    'gpt-4o-mini',
    'gpt-4-turbo-2024-04-09',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
    'o3-mini',
    'o1-preview',
    'o1-mini',
  ];

  protected getDefaultBaseUrl(): string {
    return 'https://api.openai.com/v1';
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
        throw Object.assign(new Error(`OpenAI API error (${response.status}): ${error}`), {
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
      if (!choice || !choice.message) {
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

  getPricing(model: string): { input: number; output: number } {
    // OpenAI pricing per 1M tokens (January 2025)
    const pricingMap: Record<string, { input: number; output: number }> = {
      'gpt-5-mini': { input: 0.25, output: 2.0 },
      'gpt-5-nano': { input: 0.05, output: 0.4 },
      'gpt-4o-2024-11-20': { input: 2.5, output: 10.0 },
      'gpt-4o-2024-08-06': { input: 2.5, output: 10.0 },
      'gpt-4o-2024-05-13': { input: 5.0, output: 15.0 },
      'gpt-4o-mini-2024-07-18': { input: 0.15, output: 0.6 },
      'gpt-4o-mini': { input: 0.15, output: 0.6 },
      'gpt-4-turbo-2024-04-09': { input: 10.0, output: 30.0 },
      'gpt-4-turbo': { input: 10.0, output: 30.0 },
      'gpt-4': { input: 30.0, output: 60.0 },
      'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
      'o3-mini': { input: 1.0, output: 4.0 },
      'o1-preview': { input: 15.0, output: 60.0 },
      'o1-mini': { input: 3.0, output: 12.0 },
    };

    return pricingMap[model] ?? { input: 0.25, output: 2.0 };
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
