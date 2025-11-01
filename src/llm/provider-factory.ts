import type { LLMProvider, LLMProviderConfig } from './types.js';
import { DeepSeekProvider } from './providers/deepseek.js';
import { OpenAIProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { GeminiProvider } from './providers/gemini.js';
import { XAIProvider } from './providers/xai.js';
import { GroqProvider } from './providers/groq.js';
import { CursorAgentProvider } from './providers/cursor-agent.js';

/**
 * Supported LLM provider names
 */
export type ProviderName =
  | 'deepseek'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'xai'
  | 'groq'
  | 'cursor-agent';

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
      openai: 'gpt-5-mini',
      anthropic: 'claude-3-5-haiku-20241022',
      gemini: 'gemini-2.5-flash',
      xai: 'grok-3',
      groq: 'llama-3.3-70b-versatile',
      'cursor-agent': 'cursor-agent',
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
        return new AnthropicProvider(providerConfig);
      case 'gemini':
        return new GeminiProvider(providerConfig);
      case 'xai':
        return new XAIProvider(providerConfig);
      case 'groq':
        return new GroqProvider(providerConfig);
      case 'cursor-agent':
        return new CursorAgentProvider(providerConfig);
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
      openai: 'gpt-5-mini',
      anthropic: 'claude-3-5-haiku-20241022',
      gemini: 'gemini-2.5-flash',
      xai: 'grok-3',
      groq: 'llama-3.3-70b-versatile',
      'cursor-agent': 'cursor-agent',
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
      'cursor-agent': '', // No API key needed
    };

    return envVars[provider];
  }
}
