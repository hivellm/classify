import { spawn } from 'child_process';
import type {
  LLMProvider,
  LLMProviderConfig,
  LLMCompletionRequest,
  LLMCompletionResponse,
} from '../types.js';

/**
 * cursor-agent Stream Events (based on rulebook implementation)
 */
interface CursorAgentEvent {
  type: 'system' | 'user' | 'assistant' | 'tool_call' | 'result';
  subtype?: string;
  message?: {
    role: string;
    content: Array<{ type: string; text: string }>;
  };
  session_id?: string;
  result?: string;
  is_error?: boolean;
}

/**
 * Parse a single JSON line from cursor-agent stream
 */
function parseStreamLine(line: string): CursorAgentEvent | null {
  try {
    const trimmed = line.trim();
    if (!trimmed) return null;
    return JSON.parse(trimmed) as CursorAgentEvent;
  } catch {
    return null;
  }
}

/**
 * Cursor-Agent LLM Provider
 *
 * Uses local cursor-agent CLI instead of API calls
 * Provides privacy and zero API costs
 */
export class CursorAgentProvider implements LLMProvider {
  readonly name = 'cursor-agent';
  readonly defaultModel = 'cursor-agent';
  readonly supportedModels = ['cursor-agent'];

  private timeout: number;

  constructor(config: Partial<LLMProviderConfig> = {}) {
    // cursor-agent doesn't need API key, but accept it to maintain interface compatibility
    this.timeout = config.timeout ?? 1800000; // 30 minutes like rulebook
  }

  /**
   * Complete a prompt using cursor-agent CLI
   */
  async complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    // Build prompt from messages
    const prompt = this.buildPrompt(request.messages);

    // Execute cursor-agent
    const output = await this.executeCursorAgent(prompt);

    // Parse response
    return this.parseResponse(output, request.model);
  }

  /**
   * Get pricing (cursor-agent is free)
   */
  getPricing(_model: string): { input: number; output: number } {
    return { input: 0, output: 0 };
  }

  /**
   * Build prompt from messages
   */
  private buildPrompt(messages: Array<{ role: string; content: string }>): string {
    return messages
      .map((msg) => {
        if (msg.role === 'system') {
          return `System: ${msg.content}`;
        }
        return msg.content;
      })
      .join('\n\n');
  }

  /**
   * Execute cursor-agent CLI
   */
  private async executeCursorAgent(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [
        '-p',
        '--force',
        '--approve-mcps',
        '--output-format',
        'stream-json',
        '--stream-partial-output',
        prompt,
      ];

      const child = spawn('cursor-agent', args);

      let stdout = '';
      let stderr = '';

      // Set timeout
      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`cursor-agent timeout after ${this.timeout}ms`));
      }, this.timeout);

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timeoutId);

        if (code !== 0) {
          reject(
            new Error(`cursor-agent exited with code ${code}\nStderr: ${stderr}\nStdout: ${stdout}`)
          );
        } else {
          resolve(stdout);
        }
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          reject(
            new Error(
              'cursor-agent not found. Please install: npm install -g cursor-agent'
            )
          );
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * Parse cursor-agent stream output
   */
  private parseResponse(output: string, model: string): LLMCompletionResponse {
    const lines = output.split('\n');
    let accumulatedText = '';

    for (const line of lines) {
      const event = parseStreamLine(line);
      if (!event) continue;

      // Extract assistant message
      if (event.type === 'assistant' && event.message) {
        const text = event.message.content
          .filter((c) => c.type === 'text')
          .map((c) => c.text)
          .join('');

        if (text) {
          accumulatedText = text;
        }
      }
    }

    // Extract JSON from response if present
    const jsonMatch = accumulatedText.match(/```json\n([\s\S]*?)\n```/);
    const content = jsonMatch ? jsonMatch[1] : accumulatedText || '';

    // Estimate tokens (rough estimate: 1 token ≈ 4 characters)
    const inputTokens = Math.ceil(output.length / 4);
    const outputTokens = Math.ceil((content || '').length / 4);

    return {
      content: content?.trim() || '',
      finishReason: 'stop',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      costUsd: 0, // cursor-agent is free
      model,
    };
  }
}

