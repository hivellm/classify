# Design: Cursor-Agent LLM Provider Implementation

## Architecture

### Overview
Add cursor-agent as an alternative LLM provider that executes locally using the cursor-agent CLI tool. This provides privacy benefits and no API costs.

### Key Components

#### 1. CursorAgentProvider (`src/llm/providers/cursor-agent.ts`)
```typescript
export class CursorAgentProvider extends BaseLLMProvider {
  name = 'cursor-agent';
  defaultModel = 'cursor-agent';
  
  protected async makeRequest(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    // Execute cursor-agent CLI with proper flags
    // Parse stream-json output
    // Extract content and metadata
    // Calculate tokens/cost from response
  }
}
```

#### 2. Stream Parser
- Import/adopt parsing logic from rulebook `src/agents/cursor-agent.ts`
- Parse `stream-json` format output
- Extract assistant message content
- Handle tool calls gracefully

#### 3. CLI Command Format
```bash
cursor-agent -p --force --approve-mcps --output-format stream-json --stream-partial-output "CLASSIFICATION_PROMPT"
```

### Data Flow

1. User configures cursor-agent as provider
2. ClassificationPipeline calls `provider.complete()`
3. CursorAgentProvider spawns cursor-agent CLI
4. Stream parser processes JSON lines
5. Extract classification JSON from assistant response
6. Return standardized LLMCompletionResponse

### Error Handling

- **Timeout**: 30 minutes (as in rulebook)
- **Retry**: Use BaseLLMProvider retry logic
- **Stream parsing errors**: Fallback to error response
- **Invalid JSON**: Return error with parsed text

### Configuration

```typescript
// Environment variable
USE_CURSOR_AGENT=true

// Or in client options
const client = new ClassifyClient({
  provider: 'cursor-agent',
  apiKey: 'not-needed',
});
```

### Testing Strategy

1. **Unit tests**: Mock cursor-agent CLI output
2. **Integration tests**: Skip (requires actual cursor-agent installation)
3. **Stream parsing tests**: Use samples from rulebook tests

### Performance Considerations

- **Timeout**: 30 minutes for complex classification tasks
- **Streaming**: Real-time progress callbacks
- **Memory**: Minimal overhead (streaming)
