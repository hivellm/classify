import { BaseLLMProvider } from '../base-provider.js';
import type { LLMProviderConfig, LLMCompletionRequest, LLMCompletionResponse } from '../types.js';

/**
 * Anthropic Claude Provider
 */
export class AnthropicProvider extends BaseLLMProvider {
  readonly name = 'anthropic';
  readonly defaultModel = 'claude-3-5-haiku-20241022';
  readonly supportedModels = [
    'claude-4-5-haiku',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ];

  constructor(config: LLMProviderConfig) {
    super(config);
  }

  protected getDefaultBaseUrl(): string {
    return 'https://api.anthropic.com/v1';
  }

  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const model = request.model || this.defaultModel;

    // Convert messages to Anthropic format
    const messages = request.messages.map((msg) => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.content,
    }));

    // Extract system message if present
    const systemMessage = request.messages.find((m) => m.role === 'system');

    const response = await fetch(`${this.config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        messages: messages.filter((m) => m.role !== 'user' || !systemMessage),
        system: systemMessage?.content,
        max_tokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.7,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw Object.assign(
        new Error(`Anthropic API error (${response.status}): ${JSON.stringify(error)}`),
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      content: Array<{ text: string }>;
      stop_reason: string;
      usage: {
        input_tokens: number;
        output_tokens: number;
      };
      model: string;
    };

    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;

    return {
      content: data.content[0]?.text ?? '',
      finishReason: data.stop_reason === 'end_turn' ? 'stop' : 'length',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      model: data.model,
      costUsd: this.calculateCost(inputTokens, outputTokens, model),
    };
  }

  getPricing(model: string): { input: number; output: number } {
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-4-5-haiku': { input: 0.5, output: 2.0 },
      'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
      'claude-3-5-haiku-20241022': { input: 0.8, output: 4.0 },
      'claude-3-opus-20240229': { input: 15.0, output: 75.0 },
      'claude-3-sonnet-20240229': { input: 3.0, output: 15.0 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
    };

    return pricing[model] ?? { input: 0.8, output: 4.0 };
  }
}
