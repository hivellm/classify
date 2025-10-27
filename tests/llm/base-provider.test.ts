import { describe, it, expect, vi } from 'vitest';
import { BaseLLMProvider } from '../../src/llm/base-provider.js';
import type { LLMCompletionRequest, LLMCompletionResponse } from '../../src/llm/types.js';

class TestProvider extends BaseLLMProvider {
  name = 'test-provider';
  defaultModel = 'test-model';
  supportedModels = ['test-model'];

  protected getDefaultBaseUrl(): string {
    return 'https://api.test.com';
  }

  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    return {
      content: 'test response',
      finishReason: 'stop',
      usage: { inputTokens: 10, outputTokens: 5 },
      model: request.model,
    };
  }

  getPricing(_model: string): { input: number; output: number } {
    return { input: 0.001, output: 0.002 };
  }
}

describe('BaseLLMProvider', () => {
  it('should create provider with API key', () => {
    const provider = new TestProvider({ apiKey: 'test-key' });
    expect(provider).toBeDefined();
    expect(provider.name).toBe('test-provider');
  });

  it('should throw error without API key', () => {
    expect(() => new TestProvider({ apiKey: '' })).toThrow('API key required');
  });

  it('should complete request successfully', async () => {
    const provider = new TestProvider({ apiKey: 'test-key' });
    const response = await provider.complete({
      model: 'test-model',
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(response.content).toBe('test response');
    expect(response.finishReason).toBe('stop');
  });

  it('should retry on failure', async () => {
    let attempts = 0;
    const failingProvider = new (class extends BaseLLMProvider {
      name = 'failing-provider';
      defaultModel = 'test-model';
      supportedModels = ['test-model'];

      protected getDefaultBaseUrl(): string {
        return 'https://api.test.com';
      }

      protected async makeRequest(_request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
        return {
          content: 'success after retry',
          finishReason: 'stop',
          usage: { inputTokens: 10, outputTokens: 5 },
          model: 'test-model',
        };
      }

      getPricing(_model: string): { input: number; output: number } {
        return { input: 0.001, output: 0.002 };
      }
    })({ apiKey: 'test-key', maxRetries: 3 });

    const response = await failingProvider.complete({
      model: 'test-model',
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(response.content).toBe('success after retry');
    expect(attempts).toBe(2);
  });

  it('should calculate cost', () => {
    const provider = new TestProvider({ apiKey: 'test-key' });
    const cost = provider['calculateCost'](1000, 500, 'test-model');
    expect(cost).toBeGreaterThan(0);
  });

  it('should not retry on client errors', async () => {
    const clientErrorProvider = new (class extends BaseLLMProvider {
      name = 'client-error-provider';
      defaultModel = 'test-model';
      supportedModels = ['test-model'];

      protected getDefaultBaseUrl(): string {
        return 'https://api.test.com';
      }

      protected async makeRequest(_request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
        const error = new Error('Bad Request') as Error & { status: number };
        error.status = 400;
        throw error;
      }

      getPricing(_model: string): { input: number; output: number } {
        return { input: 0.001, output: 0.002 };
      }
    })({ apiKey: 'test-key', maxRetries: 3 });

    await expect(
      clientErrorProvider.complete({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow('Bad Request');
  });
});
