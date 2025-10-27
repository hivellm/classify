# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2025-10-27

### Added

- **Cache System**:
  - SHA256-based persistent caching (filesystem storage)
  - CacheManager with LRU-like access tracking
  - Cache statistics API (hits, misses, hit rate, cost saved)
  - clearCache() and clearOlderThan() methods
  - Automatic cache initialization
  - 8 cache tests (100% passing)

- **Batch Processing**:
  - BatchProcessor for parallel document processing
  - Configurable concurrency (default: 4)
  - Recursive directory scanning
  - File extension filtering
  - Continue on error support
  - Detailed batch metrics and progress tracking

- **Enhanced Fulltext Metadata**:
  - TF-IDF-like keyword extraction (top 20 keywords)
  - LLM-powered document summarization (2-3 sentences)
  - Named entity categorization (people, orgs, locations, dates, amounts)
  - Rich extracted fields from all entities
  - Document preview (first 500 chars)
  - Full content for indexing

### Performance

**Cache Performance** (tested):
- Cold start: 32.8s, $0.000416
- Warm cache: 12ms (**2734x faster!**)
- 100% cost saving on cache hits

**Batch Processing** (10 documents):
- First run: 256s, $0.0051
- Second run (cached): 72.6s, $0.00
- Cache hit rate: 90.9%
- 3.5x speedup with cache

### Changed

- Client now checks cache before classification
- Client automatically caches results after classification
- Fulltext metadata now includes keywords and summary
- E2E test results regenerated with new metadata

## [0.2.0] - 2025-10-27

### Added

- **LLM Provider System**:
  - Interface `LLMProvider` and abstract `BaseLLMProvider` with retry logic
  - DeepSeek provider (default, $0.14/$0.28 per 1M tokens)
  - OpenAI provider (gpt-4o-mini default, multiple models supported)
  - ProviderFactory for easy provider instantiation
  - Exponential backoff retry (1s, 2s, 4s)
  - Automatic cost calculation per request

- **Document Processing**:
  - `DocumentProcessor` with @hivellm/transmutation-lite integration
  - Support for PDF, DOCX, XLSX, PPTX, HTML, TXT → Markdown conversion
  - SHA256 hash calculation for caching
  - Document metadata extraction (format, size, pages)

- **Template System**:
  - `TemplateLoader` to load 13 specialized templates
  - `TemplateSelector` with LLM-powered automatic selection
  - Template validation against schema
  - In-memory template caching

- **Classification Pipeline**:
  - Complete `ClassificationPipeline` orchestrator
  - LLM-powered entity extraction
  - LLM-powered relationship extraction
  - Metrics tracking (tokens, cost, time)

- **Prompt Compression**:
  - Integration with @hivellm/compression-prompt
  - 50% token reduction with 91% quality retention
  - Applied to both template selection and entity extraction
  - Compression metrics in results

- **Output Generation**:
  - Cypher query generator for graph databases (Nexus/Neo4j)
  - `FulltextGenerator` for search engines (Lexum/Elasticsearch)
  - Keyword extraction (TF-IDF-like algorithm)
  - LLM-powered document summarization
  - Named entity categorization (people, orgs, locations, dates, amounts)
  - Rich extracted fields for fulltext indexing

- **Testing**:
  - 59 tests across 9 test suites (100% passing)
  - E2E test script with 10 diverse documents
  - Test results visualization (HTML viewer)
  - Performance benchmarks

### Changed

- Updated from @hivellm/transmutation-lite file dependency to npm v0.6.1
- Enhanced fulltextMetadata with keywords, summary, and categorized entities
- Improved JSON mode prompts for DeepSeek compatibility
- Updated README with implementation status
- Bumped version to 0.2.0

### Performance

- **Average Classification Time**: 42 seconds per document
- **Average Cost**: $0.00053 per document (DeepSeek with compression)
- **Template Selection Accuracy**: 100% (10/10 E2E tests)
- **Confidence Score**: 93.5% average (9/10 with ≥90%)
- **Entity Extraction**: 125 total entities from 10 documents

## [0.1.0] - 2025-01-26

### Added

- Initial project setup
- 13 specialized classification templates (legal, financial, hr, engineering, marketing, compliance, sales, product, customer_support, investor_relations, accounting, strategic, operations)
- Template index system for LLM selection
- Complete technical documentation (7 docs)
- TypeScript project structure with tsup build system
- CLI framework with Commander.js
- Type definitions (ClassifyOptions, ClassifyResult)
- Comprehensive test suite (18 tests)
- CI/CD workflows (Ubuntu, Windows, macOS × Node 18, 20, 22)
- ESLint and Prettier configuration

---

**Version**: 0.2.0  
**Status**: Core Pipeline Functional - Production Ready for Testing

