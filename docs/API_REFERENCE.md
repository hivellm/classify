# Classify CLI - API Reference

**Version:** 1.0  
**Last Updated:** 2025-01-26

## CLI Commands

### `classify document`

Classify a single document with automatic template selection.

```bash
npx @hivellm/classify document <file> [options]
```

**Arguments:**
- `<file>` - Path to document (PDF, DOCX, XLSX, PPTX, etc.)

**Options:**
- `--provider <name>` - LLM provider (default: `deepseek`)
- `--model <name>` - Specific model (default: `deepseek-chat`)
- `--template <path>` - Force specific template (bypasses auto-selection)
- `--output <format>` - Output format (default: `json`)
  - `json` - Combined output (graph + fulltext)
  - `nexus-cypher` - Cypher statements only
  - `fulltext-metadata` - Full-text metadata only
  - `combined` - Same as json
- `--cache` - Enable caching (default: enabled)
- `--no-cache` - Force reprocessing, ignore cache
- `--cache-dir <path>` - Custom cache directory (default: `./.classify-cache`)
- `--compress` - Enable prompt compression (default: enabled)
- `--no-compress` - Disable prompt compression
- `--compression-ratio <number>` - Compression ratio 0.0-1.0 (default: 0.5)
- `--confidence <threshold>` - Minimum confidence (0.0-1.0, default: 0.6)
- `--show-selection` - Display template selection reasoning
- `--api-key <key>` - API key (or use env vars)
- `--verbose` - Verbose output

**Examples:**

```bash
# Basic usage (defaults: deepseek-chat, cache enabled, 50% compression)
npx @hivellm/classify document contract.pdf

# High accuracy with GPT-4o-mini
npx @hivellm/classify document important.pdf --model gpt-4o-mini

# Ultra-fast with Groq
npx @hivellm/classify document report.docx --model llama-3.1-8b-instant

# Disable compression for maximum quality
npx @hivellm/classify document legal.pdf --no-compress

# Force specific template
npx @hivellm/classify document invoice.pdf --template templates/financial.json

# Output Cypher only for Nexus
npx @hivellm/classify document data.xlsx --output nexus-cypher

# Show template selection reasoning
npx @hivellm/classify document resume.pdf --show-selection --verbose
```

### `classify batch`

Classify multiple documents in a directory.

```bash
npx @hivellm/classify batch <directory> [options]
```

**Arguments:**
- `<directory>` - Path to directory containing documents

**Options:**
- Same as `document` command
- `--pattern <glob>` - File pattern (default: `**/*`)
- `--max-concurrent <number>` - Max concurrent processing (default: 5)
- `--continue-on-error` - Continue if a file fails

**Examples:**

```bash
# Batch process entire directory
npx @hivellm/classify batch ./documents

# Only PDFs
npx @hivellm/classify batch ./docs --pattern "**/*.pdf"

# Fast batch with Groq
npx @hivellm/classify batch ./all-files --model llama-3.1-8b-instant

# High concurrency
npx @hivellm/classify batch ./data --max-concurrent 10
```

**Output:**
```
Processing: contract1.pdf [CACHED] 2ms ✓
Processing: contract2.pdf [NEW] 1,234ms → cached ✓
Processing: invoice1.pdf [CACHED] 3ms ✓
Processing: resume1.pdf [NEW] 987ms → cached ✓

Summary:
- Total: 4 files
- Cached: 2 (50%)
- New: 2
- Time: 2.2s (saved 2.2s from cache)
- Cost: $0.02 (saved $0.02)
- Tokens: 17,000 (saved 850,000 via compression)
```

### `classify check-cache`

Check if a file is in cache.

```bash
npx @hivellm/classify check-cache <file> [options]
```

**Options:**
- `--model <name>` - Model to check (default: `deepseek-chat`)
- `--template <path>` - Template to check

**Example:**
```bash
npx @hivellm/classify check-cache contract.pdf --model gpt-4o-mini

# Output:
✓ Cached
  - Processed: 2 days ago
  - Model: gpt-4o-mini
  - Template: legal
  - Time saved: 1,234ms
  - Cost saved: $0.018
```

### `classify clear-cache`

Clear cache entries.

```bash
npx @hivellm/classify clear-cache [options]
```

**Options:**
- `--all` - Clear entire cache
- `--older-than <days>` - Clear entries older than N days
- `--model <name>` - Clear entries for specific model
- `--template <name>` - Clear entries for specific template

**Examples:**
```bash
# Clear all cache
npx @hivellm/classify clear-cache --all

# Clear old entries
npx @hivellm/classify clear-cache --older-than 90

# Clear specific model cache
npx @hivellm/classify clear-cache --model gpt-4o-mini

# Clear specific file
npx @hivellm/classify clear-cache contract.pdf
```

### `classify cache-stats`

Display cache statistics.

```bash
npx @hivellm/classify cache-stats
```

**Example Output:**
```
Cache Statistics
================

Total Entries: 1,234
Cache Size: 45.2 MB
Hit Rate: 76.3%

Performance:
  - Cache Hits: 942
  - Cache Misses: 292
  - Time Saved: 2.3 hours
  - Cost Saved: $23.45

By Provider:
  - deepseek: 856 entries (69%)
  - openai: 234 entries (19%)
  - groq: 144 entries (12%)

By Template:
  - legal: 456 entries (37%)
  - financial: 334 entries (27%)
  - engineering: 223 entries (18%)
  - hr: 221 entries (18%)

Oldest Entry: 87 days ago
Newest Entry: 2 minutes ago
```

### `classify list-templates`

List available templates.

```bash
npx @hivellm/classify list-templates [--detailed]
```

**Example Output:**
```
Available Templates:
====================

1. legal.json
   Legal Documents (contracts, laws, regulations)
   Indicators: agreement, contract, parties, jurisdiction
   Types: contract, law, regulation, case

2. financial.json
   Financial Documents (invoices, reports, transactions)
   Indicators: invoice, payment, amount, vendor
   Types: invoice, receipt, report, transaction

3. hr.json
   HR Documents (resumes, policies, evaluations)
   Indicators: employee, resume, skills, experience
   Types: resume, policy, evaluation, job_description

4. engineering.json
   Engineering Documents (code, specs, design)
   Indicators: function, class, API, implementation
   Types: code, specification, design, documentation

5. base.json
   Generic Documents (fallback template)
   Types: document, text, article
```

### `classify validate-template`

Validate a template file.

```bash
npx @hivellm/classify validate-template <template-file>
```

**Example:**
```bash
npx @hivellm/classify validate-template custom-template.json

# Output:
✓ Template is valid
  - Name: custom
  - Document Types: 5
  - Entity Definitions: 12
  - Relationship Definitions: 8
  - Graph Schema: valid
  - Full-text Schema: valid
```

## Programmatic API

### Installation

```bash
npm install @hivellm/classify
```

### Basic Usage

```typescript
import { ClassifyClient } from '@hivellm/classify';

const client = new ClassifyClient({
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  cacheEnabled: true,
  cacheDir: './.classify-cache',
  compressionEnabled: true,
  compressionRatio: 0.5
});

// Classify single document
const result = await client.classify('path/to/document.pdf');

console.log(result.classification.domain);        // "legal"
console.log(result.graphStructure.cypher);       // Cypher statements
console.log(result.fulltextMetadata);            // Metadata object
console.log(result.cacheInfo.cached);            // false (first run)
```

### Configuration Options

```typescript
interface ClassifyClientConfig {
  // LLM Configuration
  provider?: 'deepseek' | 'openai' | 'anthropic' | 'gemini' | 'xai' | 'groq';
  model?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  
  // Cache Configuration
  cacheEnabled?: boolean;
  cacheDir?: string;
  cacheTtl?: number;
  
  // Compression Configuration
  compressionEnabled?: boolean;
  compressionRatio?: number;
  
  // Template Configuration
  templateDir?: string;
  autoSelectTemplate?: boolean;
  defaultTemplate?: string;
  
  // Performance Configuration
  maxConcurrent?: number;
  timeout?: number;
  retryAttempts?: number;
}
```

### Advanced Usage

```typescript
// Multiple providers with fallback
const client = new ClassifyClient({
  provider: 'deepseek',
  model: 'deepseek-chat',
  fallbackProviders: [
    { provider: 'groq', model: 'llama-3.1-8b-instant' },
    { provider: 'openai', model: 'gpt-4o-mini' }
  ]
});

// Force specific template
const result = await client.classify('contract.pdf', {
  template: 'legal',
  bypassCache: true
});

// Batch processing
const results = await client.classifyBatch([
  'doc1.pdf',
  'doc2.docx',
  'doc3.xlsx'
], {
  maxConcurrent: 10,
  continueOnError: true
});

// Access cache stats
const stats = await client.getCacheStats();
console.log(`Hit rate: ${stats.hitRate}%`);

// Clear cache
await client.clearCache({ olderThan: 90 });
```

## Response Format

### ClassificationResult

```typescript
interface ClassificationResult {
  // Cache Information
  cacheInfo: {
    cached: boolean;
    cacheKey: string;
    fileSha256: string;
    cachedAt?: string;
    ageSeconds?: number;
    hitsSaved?: number;
  };
  
  // Template Selection (if auto-selected)
  templateSelection?: {
    selected: string;
    confidence: number;
    reasoning: string;
    alternatives: Array<{ template: string; score: number }>;
    selectionTimeMs: number;
  };
  
  // Classification Results
  classification: {
    domain: string;
    docType: string;
    confidence: number;
    reasoning: string;
    
    entities: Array<{
      type: string;
      name: string;
      properties: Record<string, any>;
    }>;
    
    relationships: Array<{
      type: string;
      source: string;
      target: string;
      properties: Record<string, any>;
    }>;
    
    metadata: Record<string, any>;
  };
  
  // Graph Structure Output
  graphStructure: {
    nodes: Array<{
      id: string;
      labels: string[];
      properties: Record<string, any>;
    }>;
    
    relationships: Array<{
      type: string;
      source: string;
      target: string;
      properties: Record<string, any>;
    }>;
    
    cypher: string; // Pre-generated Cypher statements
  };
  
  // Full-text Metadata Output
  fulltextMetadata: {
    title: string;
    domain: string;
    docType: string;
    entities: string[];
    keywords: string[];
    categories: string[];
    extractedFields: Record<string, any>;
    contentSummary: string;
  };
  
  // Performance Metrics
  performance: {
    conversionTimeMs: number;
    compressionTimeMs: number;
    selectionTimeMs: number;
    classificationTimeMs: number;
    totalTimeMs: number;
    
    tokensOriginal: number;
    tokensCompressed: number;
    tokensSaved: number;
    compressionRatio: number;
    
    llmCalls: number;
    cost: number;
    costSaved: number;
  };
}
```

### Example Response

```json
{
  "cacheInfo": {
    "cached": false,
    "cacheKey": "a1b2c3...def_deepseek-chat_legal",
    "fileSha256": "a1b2c3d4e5f6...",
    "hitsSaved": 0
  },
  "templateSelection": {
    "selected": "legal.json",
    "confidence": 0.95,
    "reasoning": "Document identified as legal contract with party clauses and jurisdiction information",
    "alternatives": [
      { "template": "financial.json", "score": 0.3 },
      { "template": "base.json", "score": 0.2 }
    ],
    "selectionTimeMs": 587
  },
  "classification": {
    "domain": "legal",
    "docType": "contract",
    "confidence": 0.92,
    "reasoning": "Service agreement between two parties with standard contract clauses",
    "entities": [
      {
        "type": "Party",
        "name": "Company A",
        "properties": { "role": "service_provider" }
      },
      {
        "type": "Party",
        "name": "Company B",
        "properties": { "role": "client" }
      }
    ],
    "relationships": [
      {
        "type": "PARTY_TO",
        "source": "document",
        "target": "Company A",
        "properties": { "role": "provider" }
      }
    ],
    "metadata": {
      "effectiveDate": "2024-01-01",
      "jurisdiction": "Delaware",
      "contractValue": "$100,000",
      "term": "12 months"
    }
  },
  "graphStructure": {
    "nodes": [
      {
        "id": "doc-123",
        "labels": ["Document", "LegalDocument", "Contract"],
        "properties": {
          "title": "Service Agreement",
          "domain": "legal",
          "docType": "contract",
          "effectiveDate": "2024-01-01"
        }
      }
    ],
    "relationships": [
      {
        "type": "PARTY_TO",
        "source": "doc-123",
        "target": "party-1",
        "properties": { "role": "provider" }
      }
    ],
    "cypher": "CREATE (d:Document:LegalDocument:Contract {id: 'doc-123', ...})\nCREATE (p1:Entity:Party {name: 'Company A'})\nCREATE (d)-[:PARTY_TO {role: 'provider'}]->(p1)"
  },
  "fulltextMetadata": {
    "title": "Service Agreement",
    "domain": "legal",
    "docType": "contract",
    "entities": ["Company A", "Company B"],
    "keywords": [
      "termination", "liability", "confidentiality",
      "jurisdiction", "effective_date", "renewal"
    ],
    "categories": ["legal", "contract", "service_agreement"],
    "extractedFields": {
      "parties": ["Company A", "Company B"],
      "effectiveDate": "2024-01-01",
      "jurisdiction": "Delaware",
      "contractValue": "$100,000"
    },
    "contentSummary": "Service agreement between Company A and Company B for software development services..."
  },
  "performance": {
    "conversionTimeMs": 450,
    "compressionTimeMs": 1,
    "selectionTimeMs": 587,
    "classificationTimeMs": 1205,
    "totalTimeMs": 2243,
    "tokensOriginal": 15000,
    "tokensCompressed": 7500,
    "tokensSaved": 7500,
    "compressionRatio": 0.5,
    "llmCalls": 2,
    "cost": 0.0024,
    "costSaved": 0.0021
  }
}
```

## Cost-Optimized Models for Classification

### DeepSeek (RECOMMENDED - Best Value)
- `deepseek-chat` (default) - $0.14/$0.28 per 1M tokens
- `deepseek-r1` - Reasoning model
- `deepseek-reasoner` - Enhanced reasoning
- `deepseek-v3` - Latest version

### OpenAI (Balanced Cost/Quality)
- `gpt-4o-mini` - $0.15/$0.60 per 1M tokens (RECOMMENDED for accuracy)
- `chatgpt-4o-latest` - Latest ChatGPT
- `gpt-4o` - Standard GPT-4 Optimized
- `gpt-5-mini` - Latest mini model
- `o1-mini` - Reasoning model

### Anthropic (High Quality)
- `claude-3-5-haiku-latest` - $0.25/$1.25 per 1M tokens (RECOMMENDED - fast)
- `claude-3-7-sonnet-latest` - Sonnet 3.7
- `claude-4-sonnet-20250514` - Claude 4 (latest)
- `claude-3-5-sonnet-latest` - Sonnet 3.5

### Gemini (Google)
- `gemini-2.0-flash` - Fast and efficient (RECOMMENDED)
- `gemini-2.5-flash` - Latest flash
- `gemini-2.5-pro` - Pro version
- `gemini-1.5-flash-latest` - Legacy flash

### xAI (Grok)
- `grok-3-mini-latest` - Mini version (cost-effective)
- `grok-3-fast-latest` - Fast version
- `grok-code-fast-1` - Code-optimized
- `grok-3-latest` - Standard
- `grok-4-latest` - Latest (premium)

### Groq (Ultra-Fast Inference)
- `llama-3.1-8b-instant` - Ultra-fast, cheap (RECOMMENDED for speed)
- `llama-3.1-70b-versatile` - Balanced
- `llama-3.3-70b-versatile` - Latest 70B

## Cost Comparison

**Per 1000 documents** (~3000 tokens each, with 50% compression):

| Model | Cost | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| deepseek-chat | $0.42-0.84 | Medium | Good | Default choice |
| llama-3.1-8b-instant | $0.50-1.00 | Ultra-fast | Good | Batch processing |
| gpt-4o-mini | $0.45-1.80 | Fast | High | Accuracy-critical |
| claude-3-5-haiku | $0.75-3.75 | Fast | High | Quality + Speed |
| gemini-2.0-flash | $1.50-4.50 | Fast | Good | Google ecosystem |

**Cache Hit Savings**: $0.00 per document (99.9% cost reduction)

**Compression Savings**: ~50% token reduction = ~50% cost reduction

## Environment Variables

```bash
# LLM API Keys
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
XAI_API_KEY=xai-...
GROQ_API_KEY=gsk_...

# Default Configuration
CLASSIFY_DEFAULT_PROVIDER=deepseek
CLASSIFY_DEFAULT_MODEL=deepseek-chat
CLASSIFY_CACHE_ENABLED=true
CLASSIFY_CACHE_DIR=./.classify-cache
CLASSIFY_CACHE_TTL=2592000
CLASSIFY_COMPRESSION_ENABLED=true
CLASSIFY_COMPRESSION_RATIO=0.5
CLASSIFY_AUTO_SELECT_TEMPLATE=true
```

---

**Next**: See [TEMPLATE_SPECIFICATION.md](./TEMPLATE_SPECIFICATION.md) for template format details.

