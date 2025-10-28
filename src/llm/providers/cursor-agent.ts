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
interface SystemInitEvent {
  type: 'system';
  subtype: 'init';
  apiKeySource: string;
  cwd: string;
  session_id: string;
  model: string;
  permissionMode: string;
}

interface UserMessageEvent {
  type: 'user';
  message: {
    role: 'user';
    content: Array<{ type: string; text: string }>;
  };
  session_id: string;
}

interface AssistantMessageEvent {
  type: 'assistant';
  message: {
    role: 'assistant';
    content: Array<{ type: string; text: string }>;
  };
  session_id: string;
  timestamp_ms?: number;
}

interface ToolCallStartedEvent {
  type: 'tool_call';
  subtype: 'started';
  tool_call: {
    writeToolCall?: {
      args: {
        path: string;
        contents: string;
      };
    };
    readToolCall?: {
      args: {
        path: string;
      };
    };
    bashToolCall?: {
      args: {
        command: string;
      };
    };
    editToolCall?: {
      args: {
        path: string;
      };
    };
  };
  session_id: string;
}

interface ToolCallCompletedEvent {
  type: 'tool_call';
  subtype: 'completed';
  tool_call: {
    writeToolCall?: {
      result: {
        success?: {
          linesCreated: number;
          fileSize: number;
        };
        error?: string;
      };
    };
    readToolCall?: {
      result: {
        success?: {
          totalLines: number;
          content: string;
        };
        error?: string;
      };
    };
    bashToolCall?: {
      result: {
        success?: {
          exitCode: number;
          stdout: string;
          stderr: string;
        };
        error?: string;
      };
    };
    editToolCall?: {
      result: {
        success?: {
          linesAdded: number;
          linesRemoved: number;
          path: string;
        };
        error?: string;
      };
    };
  };
  session_id: string;
}

interface ResultEvent {
  type: 'result';
  subtype: 'success' | 'error';
  duration_ms: number;
  duration_api_ms: number;
  is_error: boolean;
  result: string;
  session_id: string;
  request_id: string;
}

type CursorAgentEvent =
  | SystemInitEvent
  | UserMessageEvent
  | AssistantMessageEvent
  | ToolCallStartedEvent
  | ToolCallCompletedEvent
  | ResultEvent;

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

      const child = spawn('cursor-agent', args, {
        env: {
          ...process.env,
          // Disable Node.js buffering for immediate output
          NODE_NO_READLINE: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
      });

      let stdout = '';
      let stderr = '';
      let hasResultEvent = false;

      // Set timeout
      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`cursor-agent timeout after ${this.timeout}ms`));
      }, this.timeout);

      // Buffer for line processing
      let buffer = '';

      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        buffer += chunk;

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // Keep incomplete line

        for (const line of lines) {
          if (line.trim()) {
            const event = parseStreamLine(line);

            // Check if we got a result event (completion)
            if (event?.type === 'result') {
              hasResultEvent = true;

              // Give 500ms for any remaining output, then kill
              setTimeout(() => {
                clearTimeout(timeoutId);
                child.kill('SIGTERM');

                // Force kill after 1s if still alive
                setTimeout(() => {
                  if (!child.killed) {
                    child.kill('SIGKILL');
                  }
                  resolve(stdout);
                }, 1000);
              }, 500);
            }
          }
        }
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timeoutId);

        if (!hasResultEvent && code !== 0) {
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
              'cursor-agent not found. Please install cursor-agent and ensure it is in PATH'
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

      // Extract assistant message - handle incremental updates
      if (event.type === 'assistant' && event.message) {
        const text = event.message.content
          .filter((c) => c.type === 'text')
          .map((c) => c.text)
          .join('');

        // stream-partial-output sends incremental deltas, so we take the latest complete text
        if (text && text.length >= accumulatedText.length) {
          accumulatedText = text;
        }
      }
    }

    // Extract JSON from response if present
    const jsonMatch = accumulatedText.match(/```json\n([\s\S]*?)\n```/);
    const content = jsonMatch ? jsonMatch[1] : accumulatedText;

    // Estimate tokens (rough estimate: 1 token ≈ 4 characters)
    const inputTokens = Math.ceil(output.length / 4);
    const outputTokens = Math.ceil((content ?? '').length / 4);

    return {
      content: content?.trim() ?? '',
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
