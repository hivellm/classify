import { BaseLLMProvider } from '../base-provider.js';
import type { LLMProviderConfig, LLMCompletionRequest, LLMCompletionResponse } from '../types.js';

/**
 * xAI Grok Provider
 */
export class XAIProvider extends BaseLLMProvider {
  readonly name = 'xai';
  readonly defaultModel = 'grok-3';
  readonly supportedModels = [
    'grok-3',
    'grok-3-mini',
    'grok-2-1212',
    'grok-2-vision-1212',
    'grok-beta',
  ];

  constructor(config: LLMProviderConfig) {
    super(config);
  }

  protected getDefaultBaseUrl(): string {
    return 'https://api.x.ai/v1';
  }

  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const model = request.model || this.defaultModel;

    // xAI uses OpenAI-compatible API
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
        response_format: request.jsonMode ? { type: 'json_object' } : undefined,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw Object.assign(
        new Error(`xAI API error (${response.status}): ${JSON.stringify(error)}`),
        { status: response.status }
      );
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

    const choice = data.choices?.[0];
    if (!choice) {
      throw new Error('No response from xAI');
    }

    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;

    return {
      content: choice.message?.content || '',
      finishReason: choice.finish_reason === 'stop' ? 'stop' : 'length',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: data.model,
      costUsd: this.calculateCost(inputTokens, outputTokens, model),
    };
  }

  getPricing(model: string): { input: number; output: number } {
    const pricing: Record<string, { input: number; output: number }> = {
      'grok-3': { input: 3.0, output: 12.0 },
      'grok-3-mini': { input: 1.0, output: 4.0 },
      'grok-2-1212': { input: 2.0, output: 10.0 },
      'grok-2-vision-1212': { input: 2.0, output: 10.0 },
      'grok-beta': { input: 5.0, output: 15.0 },
    };

    return pricing[model] || { input: 3.0, output: 12.0 };
  }
}
