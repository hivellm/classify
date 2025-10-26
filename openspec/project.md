# Classify - OpenSpec Project Context

**Project Name:** Classify  
**Type:** CLI Tool / NPX Package  
**Language:** TypeScript  
**Status:** Planning / Documentation Complete  
**Version:** 1.0.0 (planned)

## Project Overview

Classify is an intelligent document classification CLI tool that uses modern LLM models to automatically classify documents for graph databases (Nexus) and full-text search systems. It features automatic template selection, multi-provider LLM support, document conversion via Transmutation, prompt compression for cost optimization, and SHA256-based persistent caching.

## Purpose & Goals

### Primary Purpose
Provide a unified CLI tool to classify documents using LLMs, generating structured outputs for both:
- **Graph databases** (Nexus) - Cypher statements with nodes and relationships
- **Full-text search** (Elasticsearch/OpenSearch) - Structured metadata for indexing

### Key Goals
1. **Cost Optimization**: Use cost-effective models (DeepSeek default ~$0.0024/doc)
2. **Speed**: Leverage caching for 70-90% hit rate (2-5ms cached vs 2s uncached)
3. **Accuracy**: Automatic template selection via LLM (91%+ quality)
4. **Integration**: Seamless integration with Transmutation and compression-prompt
5. **Multi-system**: SHA256-based cache for shared usage across systems

## Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **CLI Framework**: Commander.js
- **Validation**: Zod
- **HTTP Client**: Axios
- **Caching**: fs-extra + crypto (SHA256)
- **Logging**: Winston

### External Dependencies
- **Transmutation**: Document conversion (PDF/DOCX/XLSX → Markdown)
  - Pure Rust binary, 98x faster than Docling
  - Called via child_process
- **compression-prompt**: Token reduction (50% compression, 91% quality)
  - Pure Rust binary, <1ms compression time
  - Called via child_process

### LLM Providers (6 providers, 30+ models)
1. **DeepSeek** (default) - Best value
2. **OpenAI** - High accuracy
3. **Anthropic** - Quality + speed
4. **Gemini** - Google ecosystem
5. **xAI** (Grok) - Alternative
6. **Groq** - Ultra-fast inference

## Architecture Overview

### Data Flow
```
Document Input (PDF/DOCX/XLSX/etc)
    ↓
SHA256 Hash → Cache Lookup
    ↓ (if miss)
Transmutation (convert to Markdown)
    ↓
compression-prompt (50% token reduction)
    ↓
LLM Stage 1: Template Selection
    ↓
LLM Stage 2: Classification
    ↓
Output Generation:
    ├─ Graph Structure (Cypher for Nexus)
    └─ Full-text Metadata (JSON for ES/OpenSearch)
    ↓
Cache Storage (SHA256-based)
```

### Core Components
1. **CLI Layer** - Commander.js commands
2. **Provider Layer** - 6 LLM provider implementations
3. **Template System** - Auto-selection + 5 built-in templates
4. **Cache Layer** - SHA256-based persistent storage
5. **Conversion Layer** - Transmutation integration
6. **Compression Layer** - compression-prompt integration
7. **Output Generators** - Graph (Cypher) + Full-text (JSON)

## Project Structure

```
classify/
├── src/
│   ├── cli/              # CLI commands (document, batch, cache-stats, etc)
│   ├── providers/        # LLM providers (deepseek, openai, anthropic, etc)
│   ├── templates/        # Template engine and registry
│   ├── selection/        # Automatic template selection
│   ├── core/             # Classification engine
│   ├── outputs/          # Output generators (graph/fulltext)
│   ├── cache/            # SHA256-based caching
│   ├── conversion/       # Transmutation integration
│   ├── compression/      # compression-prompt integration
│   └── utils/            # Helpers (SHA256, validation)
├── templates/            # Built-in templates (5 templates)
│   ├── legal.json
│   ├── financial.json
│   ├── hr.json
│   ├── engineering.json
│   └── base.json
├── docs/                 # Complete technical documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── TEMPLATE_SPECIFICATION.md
│   ├── LLM_PROVIDERS.md
│   ├── INTEGRATION.md
│   ├── CONFIGURATION.md
│   └── CACHE.md
├── tests/
├── openspec/            # OpenSpec change proposals
│   └── project.md       # This file
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features

### 1. Automatic Template Selection
- LLM analyzes document and selects best template
- No user intervention required
- Confidence scoring and alternatives

### 2. Multi-LLM Support
- 6 providers: DeepSeek, OpenAI, Anthropic, Gemini, xAI, Groq
- 30+ models to choose from
- Automatic fallback chain
- Cost-optimized defaults

### 3. SHA256-based Caching
- Content-addressable storage
- Multi-system shared cache
- 70-90% hit rate after warmup
- Cache key: `{sha256}_{provider}_{model}_{template}`

### 4. Document Conversion
- Automatic format detection
- Transmutation integration (pure Rust)
- Supports: PDF, DOCX, XLSX, PPTX, HTML, XML, etc
- 98x faster than alternatives

### 5. Prompt Compression
- compression-prompt integration
- 50% token reduction
- 91% quality retention
- ~50% cost savings

### 6. Dual Output
- **Graph Structure**: Cypher statements for Nexus
- **Full-text Metadata**: JSON for Elasticsearch/OpenSearch

## Dependencies

### NPM Packages
```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "axios": "^1.6.0",
    "zod": "^3.22.0",
    "winston": "^3.11.0",
    "fs-extra": "^11.2.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.0",
    "p-queue": "^8.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "vitest": "^1.0.0",
    "@types/fs-extra": "^11.0.4"
  }
}
```

### External Binaries
- **transmutation** - Document conversion (Rust)
- **compression-prompt** - Token compression (Rust)

## Configuration

### Environment Variables
```bash
# LLM API Keys
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
XAI_API_KEY=xai-...
GROQ_API_KEY=gsk_...

# Defaults
CLASSIFY_DEFAULT_PROVIDER=deepseek
CLASSIFY_DEFAULT_MODEL=deepseek-chat
CLASSIFY_CACHE_ENABLED=true
CLASSIFY_CACHE_DIR=./.classify-cache
CLASSIFY_COMPRESSION_ENABLED=true
```

### Configuration File
`classify.config.json` - Full configuration (see CONFIGURATION.md)

## Development Conventions

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Functional programming preferred
- Async/await for all I/O

### Naming Conventions
- Classes: PascalCase (`ClassifyClient`, `TemplateRegistry`)
- Functions: camelCase (`classifyDocument`, `getCacheStats`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_PROVIDER`, `CACHE_TTL`)
- Interfaces: PascalCase with `I` prefix optional (`ClassificationResult`)

### File Organization
- One class per file
- Index files for exports
- Tests alongside source (`*.test.ts`)
- Types in separate files when shared

### Error Handling
- Custom error classes
- Comprehensive error messages
- Graceful degradation
- Retry with exponential backoff

### Testing
- Unit tests with Vitest
- Integration tests for providers
- E2E tests for CLI commands
- Mocking for external services

## Integration Points

### Nexus (Graph Database)
- HTTP API: `POST /cypher`
- Input: Cypher statements
- Output: Node/relationship IDs

### Elasticsearch/OpenSearch (Full-text)
- HTTP API: `POST /{index}/_doc`
- Input: JSON metadata
- Output: Document ID

### Transmutation (Document Conversion)
- CLI: `transmutation convert <file> --output markdown`
- Input: Various formats
- Output: Markdown text

### compression-prompt (Token Reduction)
- CLI/Library: Rust binary
- Input: Text
- Output: Compressed text (50% reduction)

## Performance Targets

### Latency
- **Cache hit**: <5ms
- **Cache miss**: <3s (including conversion + compression + LLM)
- **Batch processing**: 1000 docs in ~12 minutes (70% cache hit)

### Cost
- **Per document**: $0.0024 (DeepSeek default)
- **With cache (70% hit)**: $0.0007 average
- **Batch (1000 docs)**: $0.72 (with cache)

### Cache Performance
- **Hit rate target**: 70-90% after warmup
- **Cache lookup**: 2-5ms
- **Storage overhead**: ~40KB per document (compressed)

## Status & Roadmap

### Current Status
- ✅ Complete technical documentation (7 documents)
- ✅ Architecture design
- ✅ API specification
- ✅ Template system design
- ✅ Provider integration plan
- ⏳ Implementation pending

### Phase 1: Core Implementation
- [ ] CLI structure (Commander.js)
- [ ] Provider abstraction layer
- [ ] Template system
- [ ] Cache implementation
- [ ] Basic tests

### Phase 2: LLM Integration
- [ ] DeepSeek provider
- [ ] OpenAI provider
- [ ] Anthropic provider
- [ ] Gemini provider
- [ ] xAI provider
- [ ] Groq provider

### Phase 3: External Integrations
- [ ] Transmutation integration
- [ ] compression-prompt integration
- [ ] Output generators (Cypher/JSON)

### Phase 4: Testing & Optimization
- [ ] Comprehensive test suite
- [ ] Performance optimization
- [ ] Cache optimization
- [ ] Error handling refinement

### Phase 5: Documentation & Publishing
- [ ] User guide
- [ ] API documentation
- [ ] Example templates
- [ ] NPM publishing

## Related Projects

### Within HiveLLM Ecosystem
- **Nexus** - Graph database (integration target)
- **Vectorizer** - Vector database (related, but not directly used)
- **Transmutation** - Document conversion (dependency)
- **compression-prompt** - Token compression (dependency)

### External
- Aider - Multi-model LLM integration
- Chat-hub - Model configuration reference

## Notes & Considerations

### Design Decisions
1. **No Vectorizer dependency**: Classify generates outputs for graph + fulltext, not vectors
2. **SHA256 caching**: Content-based, not path-based, for multi-system consistency
3. **External binaries**: Transmutation and compression-prompt called via CLI for simplicity
4. **DeepSeek default**: Best cost/quality ratio for classification tasks
5. **Automatic template selection**: Reduces user friction, improves adoption

### Future Enhancements
- [ ] Distributed cache (Redis/Memcached)
- [ ] Fine-tuned models for specific domains
- [ ] Streaming results for large documents
- [ ] Web UI for cache management
- [ ] Docker container for easy deployment
- [ ] Kubernetes operator for enterprise

---

**Last Updated**: 2025-01-26  
**Maintained By**: HiveLLM Development Team  
**Documentation**: See `docs/` directory for complete technical specs
