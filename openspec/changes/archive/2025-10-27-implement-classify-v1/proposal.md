# Implement Classify CLI v1.0

## Why

Organizations need to classify diverse documents (legal, financial, HR, engineering, etc.) for knowledge management systems, but existing solutions are either too generic (no domain expertise), too expensive (premium-only LLMs), too rigid (fixed schemas), or wasteful (reprocessing same files). A flexible, cost-effective CLI tool using domain-specific templates with intelligent LLM-based classification and SHA256 caching is needed to enable structured document classification for graph databases (Nexus, Neo4j) and full-text search engines (Lexum, Elasticsearch).

## What Changes

- **NEW** Document Classification CLI (`@hivellm/classify` package)
- Intelligent template selection using LLM analysis of document content
- 13+ domain-specific templates (legal, financial, HR, engineering, marketing, etc.)
- Multi-LLM provider support (DeepSeek default, OpenAI, Anthropic, Gemini, xAI, Groq)
- SHA256-based caching to prevent reprocessing
- Dual output: Cypher (graph databases) and JSON (fulltext search)
- Integration with `transmutation` for document conversion (PDF, DOCX, etc.)
- Integration with `compression-prompt` for 50% token reduction
- Batch processing for multiple documents
- Template validation and testing utilities

## Impact

### New Capabilities
- `cli-interface` - Command-line interface with NPX support
- `template-system` - Domain-specific classification templates
- `llm-integration` - Multi-provider LLM abstraction
- `classification-pipeline` - End-to-end document classification
- `cache-management` - SHA256-based result caching
- `output-formatters` - Cypher and fulltext JSON generation

### Affected Code
- **New repository**: `classify/` (TypeScript CLI project)
- **New package**: `@hivellm/classify` on npm
- **Dependencies**: Uses `transmutation` and `compression-prompt` from monorepo

### No Breaking Changes
This is a new standalone CLI tool with no impact on existing systems.

