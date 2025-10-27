import { describe, it, expect, vi } from 'vitest';
import { CursorAgentProvider } from '../../src/llm/providers/cursor-agent.js';

describe('CursorAgentProvider', () => {
  it('should create provider without API key', () => {
    const provider = new CursorAgentProvider();

    expect(provider.name).toBe('cursor-agent');
    expect(provider.defaultModel).toBe('cursor-agent');
    expect(provider.supportedModels).toContain('cursor-agent');
  });

  it('should return zero cost pricing', () => {
    const provider = new CursorAgentProvider();

    const pricing = provider.getPricing('cursor-agent');
    expect(pricing.input).toBe(0);
    expect(pricing.output).toBe(0);
  });

  it('should accept timeout configuration', () => {
    const provider = new CursorAgentProvider({ timeout: 60000 });
    expect(provider).toBeDefined();
  });
});

