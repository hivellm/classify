# Proposal: Add Cursor-Agent LLM Provider Support

## Why
Currently, classify uses direct LLM API calls for document classification. While this works well, there's an opportunity to add support for cursor-agent as an alternative provider that provides local execution and better privacy. Looking at the rulebook implementation, cursor-agent offers stream parsing, real-time progress, and can be integrated as a local LLM provider alternative.

## What Changes
- **ADDED** CursorAgentProvider class implementing LLMProvider interface
- **ADDED** Stream parser for cursor-agent JSON output (based on rulebook/src/agents/cursor-agent.ts)
- **ADDED** Integration point in ClassificationPipeline to support cursor-agent
- **ADDED** Environment variable: `USE_CURSOR_AGENT=true` option
- **ADDED** Unit tests for CursorAgentProvider
- **ADDED** Documentation for cursor-agent usage

## Impact
- Affected specs: LLM providers, classification pipeline
- Affected code: `src/llm/providers/cursor-agent.ts`, `src/classification/pipeline.ts`, `src/client.ts`
- Breaking change: None (additive feature)
- New dependencies: None (uses existing child_process.spawn like rulebook)

## Benefits
1. **Privacy**: Local execution with cursor-agent (no API keys needed)
2. **Cost**: No API costs for cursor-agent usage
3. **Flexibility**: Alternative provider for users who prefer cursor-agent
4. **Consistency**: Uses same pattern as rulebook implementation
