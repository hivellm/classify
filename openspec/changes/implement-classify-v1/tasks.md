# Implementation Tasks

## 1. Project Foundation
- [ ] 1.1 Initialize TypeScript project with strict mode
- [ ] 1.2 Configure ESLint and Prettier
- [ ] 1.3 Setup Vitest for testing
- [ ] 1.4 Configure tsup for building
- [ ] 1.5 Setup package.json with `@hivellm/classify` name and bin entry

## 2. CLI Framework
- [ ] 2.1 Install and configure Commander.js
- [ ] 2.2 Create main CLI entry point (src/cli/index.ts)
- [ ] 2.3 Implement `classify document` command
- [ ] 2.4 Implement `classify batch` command  
- [ ] 2.5 Implement `classify validate-template` command
- [ ] 2.6 Implement `classify stats` command
- [ ] 2.7 Add global options (--model, --cache-dir, --verbose)

## 3. Configuration System
- [ ] 3.1 Create ConfigManager class
- [ ] 3.2 Support .classifyrc.json and classify.config.js
- [ ] 3.3 Load from environment variables
- [ ] 3.4 Merge CLI options > config file > env vars > defaults
- [ ] 3.5 Validate configuration against schema

## 4. Template System
- [ ] 4.1 Create TemplateLoader class
- [ ] 4.2 Implement template validation against JSON Schema
- [ ] 4.3 Create TemplateRegistry for caching
- [ ] 4.4 Load index.json for LLM selection
- [ ] 4.5 Support custom template directories

## 5. LLM Integration
- [ ] 5.1 Define LLMProvider interface and BaseLLMProvider
- [ ] 5.2 Implement retry logic with exponential backoff
- [ ] 5.3 Implement DeepSeek provider (default)
- [ ] 5.4 Implement OpenAI provider
- [ ] 5.5 Implement Anthropic provider
- [ ] 5.6 Implement Google Gemini provider
- [ ] 5.7 Implement xAI and Groq providers
- [ ] 5.8 Create ProviderFactory for instantiation

## 6. Classification Pipeline
- [ ] 6.1 Create DocumentPreprocessor (text extraction, SHA256)
- [ ] 6.2 Integrate transmutation for binary formats
- [ ] 6.3 Implement TemplateSelector using LLM
- [ ] 6.4 Create EntityExtractor (LLM, NER, pattern-based)
- [ ] 6.5 Create RelationshipExtractor
- [ ] 6.6 Build ClassificationPipeline orchestrator
- [ ] 6.7 Track metrics (time, tokens, cost)

## 7. Caching System
- [ ] 7.1 Create CacheManager with SHA256 keys
- [ ] 7.2 Implement cache lookup and write
- [ ] 7.3 Support custom cache directory
- [ ] 7.4 Implement LRU eviction
- [ ] 7.5 Track cache statistics (hit rate, savings)

## 8. Output Formatters
- [ ] 8.1 Create GraphOutputFormatter for Cypher
- [ ] 8.2 Generate CREATE nodes and relationships
- [ ] 8.3 Support Nexus and Neo4j variants
- [ ] 8.4 Create FulltextOutputFormatter for JSON
- [ ] 8.5 Implement TF-IDF keyword extraction
- [ ] 8.6 Generate document summaries with LLM
- [ ] 8.7 Support Lexum and Elasticsearch formats
- [ ] 8.8 Create RawOutputFormatter for complete JSON

## 9. Integrations
- [ ] 9.1 Integrate compression-prompt for token reduction
- [ ] 9.2 Implement batch processing with concurrency
- [ ] 9.3 Add progress bars for batch operations
- [ ] 9.4 Create batch reporter

## 10. Testing
- [ ] 10.1 Unit tests for all core components (>80% coverage)
- [ ] 10.2 Integration tests for classification pipeline
- [ ] 10.3 E2E tests with sample documents
- [ ] 10.4 Performance benchmarks

## 11. Documentation
- [ ] 11.1 Add JSDoc comments to all public APIs
- [ ] 11.2 Update README with usage examples
- [ ] 11.3 Create user guide
- [ ] 11.4 Document template creation
- [ ] 11.5 Add troubleshooting guide

## 12. Publishing
- [ ] 12.1 Configure package.json for npm publishing
- [ ] 12.2 Setup GitHub Actions CI/CD
- [ ] 12.3 Test installation from tarball
- [ ] 12.4 Publish v1.0.0 to npm registry

