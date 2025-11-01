import { BaseLLMProvider } from '../base-provider.js';
import type { LLMProviderConfig, LLMCompletionRequest, LLMCompletionResponse } from '../types.js';

/**
 * Google Gemini Provider
 */
export class GeminiProvider extends BaseLLMProvider {
  readonly name = 'gemini';
  readonly defaultModel = 'gemini-2.5-flash';
  readonly supportedModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
  ];

  constructor(config: LLMProviderConfig) {
    super(config);
  }

  protected getDefaultBaseUrl(): string {
    return 'https://generativelanguage.googleapis.com/v1beta';
  }

  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const model = request.model || this.defaultModel;

    // Convert messages to Gemini format
    const contents = request.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Extract system instruction
    const systemInstruction = request.messages.find((m) => m.role === 'system');

    const response = await fetch(
      `${this.config.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents.filter((c) => c.role !== 'user' || !systemInstruction),
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction.content }] }
            : undefined,
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 8192,
            responseMimeType: request.jsonMode ? 'application/json' : 'text/plain',
          },
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw Object.assign(
        new Error(`Gemini API error (${response.status}): ${JSON.stringify(error)}`),
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      candidates: Array<{
        content: { parts: Array<{ text: string }> };
        finishReason: string;
      }>;
      usageMetadata: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
      };
    };

    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('No response from Gemini');
    }

    const inputTokens = data.usageMetadata?.promptTokenCount || 0;
    const outputTokens = data.usageMetadata?.candidatesTokenCount || 0;

    return {
      content: candidate.content?.parts?.[0]?.text ?? '',
      finishReason: candidate.finishReason === 'STOP' ? 'stop' : 'length',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      model,
      costUsd: this.calculateCost(inputTokens, outputTokens, model),
    };
  }

  getPricing(model: string): { input: number; output: number } {
    const pricing: Record<string, { input: number; output: number }> = {
      'gemini-2.5-flash': { input: 0.05, output: 0.2 },
      'gemini-2.0-flash-exp': { input: 0.0, output: 0.0 }, // Free during preview
      'gemini-1.5-pro': { input: 1.25, output: 5.0 },
      'gemini-1.5-flash': { input: 0.075, output: 0.3 },
      'gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },
    };

    return pricing[model] ?? { input: 0.05, output: 0.2 };
  }
}
