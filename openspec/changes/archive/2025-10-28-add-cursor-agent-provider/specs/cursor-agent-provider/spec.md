# Cursor-Agent Provider Specification

## ADDED Requirements

### Requirement: Cursor-Agent as LLM Provider

The system SHALL support cursor-agent as an alternative LLM provider for document classification.

#### Scenario: User selects cursor-agent provider
- **WHEN** user initializes ClassifyClient with provider='cursor-agent'
- **THEN** system creates CursorAgentProvider instance
- **AND** no API key is required
- **AND** system uses local cursor-agent CLI execution

#### Scenario: Classification with cursor-agent
- **GIVEN** cursor-agent is installed and available
- **WHEN** user calls client.classify() with a document
- **THEN** system spawns cursor-agent CLI process
- **AND** passes classification prompt via CLI arguments
- **AND** parses stream-json output from cursor-agent
- **AND** extracts classification result from assistant message
- **AND** returns standard LLMCompletionResponse

#### Scenario: Stream parsing
- **GIVEN** cursor-agent outputs stream-json format
- **WHEN** system receives output lines
- **THEN** parser processes each JSON line as CursorAgentEvent
- **AND** accumulates assistant message text
- **AND** tracks tool calls for progress reporting
- **AND** detects completion via ResultEvent

### Requirement: Error Handling

The system SHALL handle cursor-agent errors gracefully.

#### Scenario: cursor-agent not installed
- **WHEN** cursor-agent CLI is not found in PATH
- **THEN** system throws descriptive error
- **AND** suggests installation instructions

#### Scenario: Timeout handling
- **GIVEN** cursor-agent takes longer than 30 minutes
- **WHEN** timeout is reached
- **THEN** system kills cursor-agent process
- **AND** returns error response
- **AND** includes partial output if available

#### Scenario: Invalid JSON response
- **WHEN** cursor-agent returns invalid JSON for classification
- **THEN** system attempts to extract JSON from text
- **AND** returns error if extraction fails
- **AND** includes raw response in error message

### Requirement: Configuration

The system SHALL provide configuration options for cursor-agent.

#### Scenario: Environment variable configuration
- **WHEN** USE_CURSOR_AGENT environment variable is set to 'true'
- **THEN** system defaults to cursor-agent provider
- **AND** bypasses API key validation

#### Scenario: Programmatic configuration
- **WHEN** user creates ClassifyClient with provider='cursor-agent'
- **THEN** system accepts configuration
- **AND** apiKey parameter is optional
- **AND** model parameter defaults to 'cursor-agent'

### Requirement: Progress Reporting

The system SHALL report real-time progress from cursor-agent.

#### Scenario: Stream progress callbacks
- **WHEN** cursor-agent streams output
- **THEN** system emits progress events
- **AND** reports text accumulation every 500 characters
- **AND** reports tool call execution
- **AND** reports completion with summary

### Requirement: Token and Cost Estimation

The system SHALL estimate tokens and cost for cursor-agent.

#### Scenario: Token calculation
- **WHEN** cursor-agent completes classification
- **THEN** system estimates input tokens from prompt length
- **AND** estimates output tokens from response length
- **AND** uses standard token estimation (~4 chars/token)

#### Scenario: Cost reporting
- **WHEN** system calculates cost for cursor-agent
- **THEN** cost is reported as $0.00
- **AND** cost savings are highlighted in statistics
