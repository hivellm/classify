import { BaseLLMProvider } from '../base-provider.js';
import type { LLMProviderConfig, LLMCompletionRequest, LLMCompletionResponse } from '../types.js';

/**
 * Groq Provider (Ultra-fast inference)
 */
export class GroqProvider extends BaseLLMProvider {
  readonly name = 'groq';
  readonly defaultModel = 'llama-3.3-70b-versatile';
  readonly supportedModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ];

  constructor(config: LLMProviderConfig) {
    super(config);
  }

  protected getDefaultBaseUrl(): string {
    return 'https://api.groq.com/openai/v1';
  }

  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const model = request.model || this.defaultModel;

    // Groq uses OpenAI-compatible API
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
        new Error(`Groq API error (${response.status}): ${JSON.stringify(error)}`),
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
      throw new Error('No response from Groq');
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
      'llama-3.3-70b-versatile': { input: 0.59, output: 0.79 },
      'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
      'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
      'mixtral-8x7b-32768': { input: 0.24, output: 0.24 },
      'gemma2-9b-it': { input: 0.2, output: 0.2 },
    };

    return pricing[model] || { input: 0.59, output: 0.79 };
  }
}
