# Classify CLI - System Architecture

**Version:** 1.0  
**Last Updated:** 2025-01-26

## Overview

Classify is a TypeScript-based CLI tool that uses modern LLM models to automatically classify documents for graph database (Nexus) and full-text indexing. It features automatic template selection, multi-provider LLM support, document conversion via Transmutation, prompt compression for cost optimization, and SHA256-based caching for multi-system usage.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Classify CLI                            │
├─────────────────────────────────────────────────────────────────┤
│  Input Layer          │  Processing Layer    │  Output Layer    │
│                       │                      │                  │
│  ┌──────────────┐    │  ┌────────────────┐ │  ┌─────────────┐ │
│  │ File Input   │───▶│  │ Transmutation  │ │  │ Graph       │ │
│  │ (PDF,DOCX,   │    │  │ (Markdown)     │ │  │ Structure   │ │
│  │  XLSX,etc)   │    │  └────────────────┘ │  │ (Cypher)    │ │
│  └──────────────┘    │         │           │  └─────────────┘ │
│                       │         ▼           │         │         │
│  ┌──────────────┐    │  ┌────────────────┐ │         ▼         │
│  │ Cache Lookup │◀──▶│  │ Compression    │ │  ┌─────────────┐ │
│  │ (SHA256)     │    │  │ (50% tokens)   │ │  │ Full-text   │ │
│  └──────────────┘    │  └────────────────┘ │  │ Metadata    │ │
│                       │         │           │  └─────────────┘ │
│                       │         ▼           │                  │
│                       │  ┌────────────────┐ │                  │
│                       │  │ Template       │ │                  │
│                       │  │ Selection      │ │                  │
│                       │  │ (LLM Stage 1)  │ │                  │
│                       │  └────────────────┘ │                  │
│                       │         │           │                  │
│                       │         ▼           │                  │
│                       │  ┌────────────────┐ │                  │
│                       │  │ Classification │ │                  │
│                       │  │ (LLM Stage 2)  │ │                  │
│                       │  └────────────────┘ │                  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Document Conversion Layer (Transmutation)

**Purpose**: Convert various file formats to LLM-friendly Markdown.

**Supported Formats**:
- Documents: PDF, DOCX, XLSX, PPTX, HTML, XML, TXT, CSV, RTF, ODT
- Images: JPG, PNG, TIFF, BMP, GIF, WEBP (with OCR)
- Audio/Video: MP3, WAV, MP4, etc (with transcription)
- Archives: ZIP

**Integration**:
```typescript
class DocumentConverter {
  async convert(filePath: string): Promise<string> {
    // Call Transmutation CLI/API
    const result = await exec(`transmutation convert ${filePath} --output markdown`);
    return result.stdout; // Markdown content
  }
}
```

**Performance**:
- PDF: ~98x faster than Docling (0.37s vs 35s per 20-page doc)
- XLSX: 148 pages/second
- PPTX: 1639 pages/second
- Pure Rust, no Python dependencies

### 2. Prompt Compression Layer (compression-prompt)

**Purpose**: Reduce token count by 50% while maintaining 91% quality.

**How It Works**:
1. **IDF Scoring**: Preserve rare/technical terms
2. **Position Weight**: Prioritize start/end content
3. **Entity Detection**: Keep names, numbers, URLs
4. **Entropy Analysis**: Maintain vocabulary diversity

**Integration**:
```typescript
class PromptCompressor {
  async compress(text: string, ratio: number = 0.5): Promise<string> {
    // Call compression-prompt Rust library
    const result = await exec(`compression-prompt compress --ratio ${ratio}`, {
      input: text
    });
    return result.stdout; // Compressed text
  }
}
```

**Benefits**:
- 50% token reduction
- 91% quality retention (validated across 6 LLMs)
- <1ms compression time
- **Cost Savings**: ~50% reduction in LLM API costs

**Example**:
```
Original:    1,662,729 tokens
Compressed:    831,364 tokens
Savings:       831,365 tokens (50.0%)
Cost Saved:    ~$0.10-0.40 per 1M tokens
```

### 3. Cache Layer (SHA256-based)

**Purpose**: Persistent caching for multi-system usage.

**Architecture**:
```
.classify-cache/
├── index.json              # Cache metadata
├── results/
│   ├── {sha256}_{provider}_{model}_{template}.json
│   └── ...
└── stats/
    └── cache-stats.json    # Metrics
```

**Cache Key Composition**:
```typescript
const cacheKey = `${sha256(fileContent)}_${provider}_${model}_${template}`;
```

**Cache Lookup Flow**:
```
1. Calculate SHA256 of file content
2. Build cache key: sha256 + provider + model + template
3. Check cache directory for matching file
4. If found && valid: return cached result (2-5ms)
5. If not found: process with LLM and cache result (1000-3000ms)
```

**Cache Benefits**:
- **Speed**: 2-5ms vs 1000-3000ms (200-600x faster)
- **Cost**: $0.00 vs $0.01-0.05 per document
- **Multi-system**: Shared cache across applications
- **Consistency**: Same file = same result (per model)

### 4. Template Selection Engine

**Purpose**: Automatically select the best classification template using LLM.

**Process**:

**Stage 1: Template Catalog Generation**
```typescript
interface TemplateCatalog {
  templates: Array<{
    name: string;
    display_name: string;
    description: string;
    indicators: string[];
    document_types: string[];
    example_titles: string[];
  }>;
}

// Extract metadata from all templates
const catalog = templateRegistry.getCatalog();
```

**Stage 2: LLM-based Selection**
```typescript
const selectionPrompt = `
You are a document classification expert. Select the most appropriate template.

AVAILABLE TEMPLATES:
${catalog.toMarkdown()}

DOCUMENT TO ANALYZE:
${compressedDocument}  // Already compressed!

Return JSON: {"selected_template": "legal.json", "confidence": 0.95, "reasoning": "..."}
`;

const selection = await llm.selectTemplate(selectionPrompt);
```

**Template Metadata Example**:
```json
{
  "metadata": {
    "name": "legal",
    "display_name": "Legal Documents",
    "description": "Contracts, laws, regulations, cases",
    "indicators": ["agreement", "contract", "parties", "jurisdiction"],
    "document_types": ["contract", "law", "regulation"],
    "example_titles": ["Service Agreement", "Employment Contract"]
  }
}
```

### 5. Classification Engine

**Purpose**: Extract entities, relationships, and metadata using selected template.

**Stage 2: Classification with Template**
```typescript
const classificationPrompt = `
Template: ${selectedTemplate.name}
Document Types: ${selectedTemplate.document_types}
Entities: ${selectedTemplate.entity_definitions}
Graph Schema: ${selectedTemplate.graph_schema}
Full-text Schema: ${selectedTemplate.fulltext_schema}

DOCUMENT:
${compressedDocument}  // Already compressed!

Extract:
1. Entities and relationships for graph structure
2. Metadata fields for full-text indexing
3. Keywords and categories

Return structured JSON.
`;

const result = await llm.classify(classificationPrompt);
```

### 6. Output Generators

**Purpose**: Transform classification results into target formats.

**Graph Output (Nexus Cypher)**:
```typescript
class GraphOutputGenerator {
  generate(classification: ClassificationResult): string {
    const cypher = [];
    
    // Create document node
    cypher.push(`
      CREATE (d:Document:${classification.doc_type} {
        id: "${classification.id}",
        title: "${classification.title}",
        domain: "${classification.domain}"
      })
    `);
    
    // Create entity nodes and relationships
    classification.entities.forEach(entity => {
      cypher.push(`
        CREATE (e:Entity:${entity.type} {name: "${entity.name}"})
        CREATE (d)-[:${entity.relationship}]->(e)
      `);
    });
    
    return cypher.join('\n');
  }
}
```

**Full-text Output**:
```typescript
class FulltextOutputGenerator {
  generate(classification: ClassificationResult): object {
    return {
      title: classification.title,
      domain: classification.domain,
      doc_type: classification.doc_type,
      entities: classification.entities.map(e => e.name),
      keywords: classification.keywords,
      categories: classification.categories,
      extracted_fields: classification.metadata,
      content_summary: classification.summary
    };
  }
}
```

## Data Flow

### Complete Classification Pipeline

```
1. INPUT: User provides file path
   ├─ Check file extension
   └─ Calculate SHA256 hash

2. CACHE LOOKUP
   ├─ Build cache key: sha256 + provider + model + template
   ├─ If FOUND: Return cached result (2-5ms) ✓
   └─ If NOT FOUND: Continue to conversion

3. DOCUMENT CONVERSION (Transmutation)
   ├─ PDF/DOCX/XLSX → Markdown
   ├─ Time: 0.1-1s depending on size
   └─ Output: Clean Markdown text

4. PROMPT COMPRESSION (compression-prompt)
   ├─ Compress Markdown by 50%
   ├─ Time: <1ms
   ├─ Token reduction: 50%
   └─ Cost savings: ~50%

5. TEMPLATE SELECTION (LLM Stage 1)
   ├─ Load template catalog
   ├─ Send to LLM: document + catalog
   ├─ LLM selects best template
   ├─ Time: 500-1000ms
   └─ Output: {"selected": "legal.json", "confidence": 0.95}

6. CLASSIFICATION (LLM Stage 2)
   ├─ Load selected template (full schema)
   ├─ Send to LLM: document + template
   ├─ LLM extracts entities, relationships, metadata
   ├─ Time: 1000-2000ms
   └─ Output: Complete classification result

7. OUTPUT GENERATION
   ├─ Generate Graph Structure (Cypher)
   ├─ Generate Full-text Metadata (JSON)
   └─ Time: <10ms

8. CACHE STORAGE
   ├─ Store result in cache
   ├─ Update cache index
   └─ Update statistics

9. RETURN RESULT
   └─ Send to user (combined or specific format)
```

### Token and Cost Analysis

**Example Document**: 20-page PDF contract

| Stage | Tokens | Cost (DeepSeek) | Time |
|-------|--------|-----------------|------|
| Original PDF to Markdown | 15,000 | - | 0.4s |
| After Compression | 7,500 | - | <1ms |
| Template Selection | 8,000 | $0.0011 | 600ms |
| Classification | 9,500 | $0.0013 | 1,200ms |
| **Total** | **17,000** | **$0.0024** | **~2.2s** |

**Without Compression**: 32,000 tokens, $0.0045 (~87% cost increase)

**With Cache Hit**: 0 tokens, $0.00, 3ms (99.9% savings)

## Component Interactions

### LLM Provider Factory

```typescript
class ProviderFactory {
  static create(provider: string, model: string): LLMProvider {
    switch(provider) {
      case 'deepseek':
        return new DeepSeekProvider(model || 'deepseek-chat');
      case 'openai':
        return new OpenAIProvider(model || 'gpt-4o-mini');
      case 'anthropic':
        return new AnthropicProvider(model || 'claude-3-5-haiku-latest');
      case 'gemini':
        return new GeminiProvider(model || 'gemini-2.0-flash');
      case 'xai':
        return new XAIProvider(model || 'grok-3-mini-latest');
      case 'groq':
        return new GroqProvider(model || 'llama-3.1-8b-instant');
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
```

### Model Selection Strategy

```typescript
interface ModelSelectionStrategy {
  // Priority order for fallback
  fallbackChain: string[];
  
  // Model selection based on use case
  selectForUseCase(useCase: 'speed' | 'accuracy' | 'cost' | 'balanced'): string;
}

const strategy: ModelSelectionStrategy = {
  fallbackChain: [
    'deepseek-chat',        // Best value
    'llama-3.1-8b-instant', // Speed
    'gpt-4o-mini',          // Accuracy
    'gemini-2.0-flash'      // Alternative
  ],
  
  selectForUseCase(useCase) {
    switch(useCase) {
      case 'speed': return 'llama-3.1-8b-instant';
      case 'accuracy': return 'gpt-4o-mini';
      case 'cost': return 'deepseek-chat';
      case 'balanced': return 'deepseek-chat';
    }
  }
};
```

## Performance Characteristics

### Throughput

| Scenario | Time per Document | Tokens per Document | Cost per Document |
|----------|-------------------|---------------------|-------------------|
| **Cold Start** (no cache) | 2.2s | 17,000 | $0.0024 |
| **Warm Cache** | 3ms | 0 | $0.00 |
| **Batch (1000 docs, 70% cache hit)** | 680s total | 5.1M total | $0.72 |

### Scalability

- **Single Instance**: 1,600 docs/hour (cold start)
- **With 70% Cache Hit**: 4,500 docs/hour
- **Multi-Instance**: Linear scaling (shared cache)

### Resource Usage

- **Memory**: 50-100 MB per instance
- **Disk**: ~50 KB per cached document
- **Network**: 2-10 KB per LLM API call (compressed)

## Error Handling

### Fallback Strategy

```
LLM Call Failed
├─ Retry with exponential backoff (3 attempts)
├─ If still failing: Try fallback model
├─ If all models fail: Return partial result
└─ Log error and cache failure (don't cache)
```

### Partial Results

If classification fails but template selection succeeds:
```json
{
  "status": "partial",
  "template_selection": { /* ... */ },
  "classification": null,
  "error": "LLM timeout after 3 retries"
}
```

## Security Considerations

1. **API Keys**: Never logged or cached
2. **File Content**: Hashed (SHA256) but not stored in cache keys
3. **Cache Isolation**: Per-model separation prevents cross-contamination
4. **Input Validation**: All file types validated before processing

## Future Enhancements

1. **Streaming**: Real-time results for large documents
2. **Distributed Cache**: Redis/Memcached support
3. **Fine-tuned Models**: Custom models for specific domains
4. **Batch Optimization**: Parallel LLM calls
5. **Vector Search**: Semantic cache lookup (similar documents)

## Integration Points

### Nexus (Graph Database)
- Direct Cypher execution via HTTP API
- Bulk ingestion support
- Node/relationship validation

### Full-text Search (Elasticsearch/OpenSearch)
- Direct indexing via HTTP API
- Bulk indexing support
- Schema validation

### Transmutation (Document Conversion)
- CLI integration
- API integration (future)
- Format detection

### compression-prompt (Token Reduction)
- Rust library integration
- Configurable compression ratios
- Quality validation

## Monitoring and Observability

### Metrics to Track

- **Cache Hit Rate**: Target >70%
- **Average Latency**: Cold vs Warm
- **Token Usage**: Per document, per template
- **Cost**: Per document, per model
- **Error Rate**: Per provider, per model
- **Quality Score**: Template selection confidence

### Logging

- All LLM calls (without content)
- Cache hits/misses
- Errors and retries
- Performance metrics

---

**Next**: See [API_REFERENCE.md](./API_REFERENCE.md) for CLI commands and programmatic usage.

