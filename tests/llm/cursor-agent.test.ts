import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spawn } from 'child_process';
import { CursorAgentProvider } from '../../src/llm/providers/cursor-agent.js';

// Mock spawn to avoid actual CLI calls in tests
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

describe('CursorAgentProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('should parse stream output correctly', async () => {
    const mockOutput = `{"type":"system","subtype":"init","apiKeySource":"config","cwd":"/test","session_id":"test-123","model":"claude-sonnet-4","permissionMode":"accept"}
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"Result: success"}]},"session_id":"test-123","timestamp_ms":1000}
{"type":"result","subtype":"success","duration_ms":1500,"duration_api_ms":1200,"is_error":false,"result":"success","session_id":"test-123","request_id":"req-123"}`;

    // Mock successful spawn
    const mockChild = {
      on: vi.fn((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 100); // Give more time for data to process
        }
        return mockChild;
      }),
      stdout: {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            // Emit data before close
            setTimeout(() => callback(Buffer.from(mockOutput)), 5);
          }
          return mockChild.stdout;
        }),
      },
      stderr: {
        on: vi.fn(() => mockChild.stderr),
      },
      kill: vi.fn(),
      killed: false,
    };

    (spawn as any).mockReturnValue(mockChild);

    const provider = new CursorAgentProvider();
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'test' }],
      model: 'cursor-agent',
    });

    expect(result.content).toContain('success');
    expect(result.finishReason).toBe('stop');
    expect(result.costUsd).toBe(0);
  });

  it('should handle missing cursor-agent CLI gracefully', async () => {
    // Mock spawn to throw ENOENT error
    (spawn as any).mockImplementation(() => {
      const mockChild = {
        on: vi.fn((event, callback) => {
          if (event === 'error') {
            const error = new Error('not found');
            (error as any).code = 'ENOENT';
            setTimeout(() => callback(error), 10);
          }
          return mockChild;
        }),
        stdout: {
          on: vi.fn(() => mockChild.stdout),
        },
        stderr: {
          on: vi.fn(() => mockChild.stderr),
        },
        kill: vi.fn(),
      };
      return mockChild;
    });

    const provider = new CursorAgentProvider();
    
    await expect(
      provider.complete({
        messages: [{ role: 'user', content: 'test' }],
        model: 'cursor-agent',
      })
    ).rejects.toThrow('cursor-agent not found');
  });
});
