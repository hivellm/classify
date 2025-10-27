import type { LLMProvider, LLMProviderConfig } from './types.js';
import { DeepSeekProvider } from './providers/deepseek.js';
import { OpenAIProvider } from './providers/openai.js';

/**
 * Supported LLM provider names
 */
export type ProviderName = 'deepseek' | 'openai' | 'anthropic' | 'gemini' | 'xai' | 'groq';

/**
 * Factory for creating LLM providers
 */
export class ProviderFactory {
  /**
   * Create an LLM provider instance
   */
  static create(
    provider: ProviderName,
    config: Omit<LLMProviderConfig, 'model'> & { model?: string }
  ): LLMProvider {
    const defaultModels: Record<ProviderName, string> = {
      deepseek: 'deepseek-chat',
      openai: 'gpt-4o-mini',
      anthropic: 'claude-3-5-haiku-latest',
      gemini: 'gemini-2.0-flash',
      xai: 'grok-3-mini-latest',
      groq: 'llama-3.1-8b-instant',
    };

    const providerConfig: LLMProviderConfig = {
      ...config,
      model: config.model ?? defaultModels[provider],
    };

    switch (provider) {
      case 'deepseek':
        return new DeepSeekProvider(providerConfig);
      case 'openai':
        return new OpenAIProvider(providerConfig);
      case 'anthropic':
        // TODO: Implement AnthropicProvider
        throw new Error('Anthropic provider not yet implemented');
      case 'gemini':
        // TODO: Implement GeminiProvider
        throw new Error('Gemini provider not yet implemented');
      case 'xai':
        // TODO: Implement xAIProvider
        throw new Error('xAI provider not yet implemented');
      case 'groq':
        // TODO: Implement GroqProvider
        throw new Error('Groq provider not yet implemented');
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Get default model for a provider
   */
  static getDefaultModel(provider: ProviderName): string {
    const defaults: Record<ProviderName, string> = {
      deepseek: 'deepseek-chat',
      openai: 'gpt-4o-mini',
      anthropic: 'claude-3-5-haiku-latest',
      gemini: 'gemini-2.0-flash',
      xai: 'grok-3-mini-latest',
      groq: 'llama-3.1-8b-instant',
    };

    return defaults[provider];
  }

  /**
   * Get API key environment variable name for a provider
   */
  static getApiKeyEnvVar(provider: ProviderName): string {
    const envVars: Record<ProviderName, string> = {
      deepseek: 'DEEPSEEK_API_KEY',
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      gemini: 'GEMINI_API_KEY',
      xai: 'XAI_API_KEY',
      groq: 'GROQ_API_KEY',
    };

    return envVars[provider];
  }
}

