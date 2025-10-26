# Classify CLI - Integration Guide

**Version:** 1.0  
**Last Updated:** 2025-01-26

## Overview

This guide covers integrating Classify with Nexus (graph database), full-text search systems (Elasticsearch/OpenSearch), Transmutation (document conversion), and compression-prompt (cost optimization).

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Document Sources                      │
│  (PDF, DOCX, XLSX, Local Files, Network Shares, APIs)  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Classify CLI       │
          │  ┌─────────────────┐ │
          │  │ Transmutation   │ │ ← Document Conversion
          │  └─────────────────┘ │
          │  ┌─────────────────┐ │
          │  │ Compression     │ │ ← Prompt Optimization
          │  └─────────────────┘ │
          │  ┌─────────────────┐ │
          │  │ Classification  │ │ ← LLM Processing
          │  └─────────────────┘ │
          └──────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌────────┐           ┌──────────────┐
    │ Nexus  │           │  Full-text   │
    │ (Graph)│           │   Search     │
    └────────┘           └──────────────┘
```

## Nexus Integration (Graph Database)

### Direct Cypher Execution

**Generate and execute Cypher statements**:

```bash
# Generate Cypher output
npx @hivellm/classify document contract.pdf --output nexus-cypher > contract.cypher

# Execute in Nexus
curl -X POST http://localhost:15474/cypher \
  -H "Content-Type: application/json" \
  -d @contract.cypher
```

**One-liner pipeline**:

```bash
npx @hivellm/classify document contract.pdf --output nexus-cypher | \
  curl -X POST http://localhost:15474/cypher \
    -H "Content-Type: application/json" \
    -d @-
```

### Batch Ingestion

**Process entire directory and bulk insert**:

```bash
#!/bin/bash
# batch-to-nexus.sh

DOCS_DIR="./documents"
OUTPUT_FILE="batch-ingest.cypher"

# Clear output file
> $OUTPUT_FILE

# Process all documents
for file in $DOCS_DIR/*; do
  echo "Processing: $file"
  npx @hivellm/classify document "$file" \
    --output nexus-cypher \
    --cache >> $OUTPUT_FILE
done

# Bulk insert into Nexus
curl -X POST http://localhost:15474/cypher/batch \
  -H "Content-Type: application/json" \
  -d @$OUTPUT_FILE

echo "Batch ingestion complete!"
```

### Programmatic Integration

```typescript
import { ClassifyClient } from '@hivellm/classify';
import axios from 'axios';

const classifyClient = new ClassifyClient({
  provider: 'deepseek',
  model: 'deepseek-chat',
  cacheEnabled: true
});

const nexusClient = axios.create({
  baseURL: 'http://localhost:15474',
  headers: { 'Content-Type': 'application/json' }
});

async function classifyAndIngestToNexus(filePath: string) {
  // Classify document
  const result = await classifyClient.classify(filePath);
  
  // Extract Cypher statements
  const cypher = result.graphStructure.cypher;
  
  // Execute in Nexus
  const response = await nexusClient.post('/cypher', {
    query: cypher,
    params: {}
  });
  
  console.log(`Ingested: ${filePath} → ${response.data.nodesCreated} nodes`);
  
  return response.data;
}

// Batch processing
const files = ['contract1.pdf', 'contract2.pdf', 'invoice1.pdf'];
for (const file of files) {
  await classifyAndIngestToNexus(file);
}
```

### Example Cypher Output

```cypher
// Document node
CREATE (d:Document:LegalDocument:Contract {
  id: "doc-a1b2c3d4",
  title: "Service Agreement",
  domain: "legal",
  doc_type: "contract",
  effective_date: "2024-01-01",
  jurisdiction: "Delaware",
  created_at: "2025-01-26T10:30:00Z",
  file_sha256: "a1b2c3d4e5f6...",
  file_path: "/docs/contract.pdf"
})

// Entity nodes
CREATE (p1:Entity:Party {
  id: "party-123",
  name: "Company A",
  type: "company",
  role: "service_provider"
})

CREATE (p2:Entity:Party {
  id: "party-456",
  name: "Company B",
  type: "company",
  role: "client"
})

// Relationships
CREATE (d)-[:PARTY_TO {
  role: "provider",
  date_signed: "2024-01-01"
}]->(p1)

CREATE (d)-[:PARTY_TO {
  role: "client",
  date_signed: "2024-01-01"
}]->(p2)

// Metadata
CREATE (d)-[:HAS_METADATA {
  contract_value: "$100,000",
  term: "12 months",
  renewal_terms: "automatic"
}]->(:Metadata)
```

## Full-text Search Integration

### Elasticsearch

**Index document with metadata**:

```bash
# Generate full-text metadata
npx @hivellm/classify document contract.pdf \
  --output fulltext-metadata | \
  curl -X POST http://localhost:9200/documents/_doc \
    -H "Content-Type: application/json" \
    -d @-
```

**Programmatic Integration**:

```typescript
import { Client } from '@elastic/elasticsearch';
import { ClassifyClient } from '@hivellm/classify';

const esClient = new Client({ node: 'http://localhost:9200' });
const classifyClient = new ClassifyClient({ provider: 'deepseek' });

async function indexDocument(filePath: string) {
  // Classify document
  const result = await classifyClient.classify(filePath);
  
  // Prepare Elasticsearch document
  const esDoc = {
    ...result.fulltextMetadata,
    file_path: filePath,
    file_sha256: result.cacheInfo.fileSha256,
    indexed_at: new Date(),
    
    // Include graph structure for hybrid search
    graph_nodes: result.graphStructure.nodes,
    graph_relationships: result.graphStructure.relationships
  };
  
  // Index in Elasticsearch
  await esClient.index({
    index: 'documents',
    id: result.cacheInfo.fileSha256,
    document: esDoc
  });
  
  console.log(`Indexed: ${filePath}`);
}
```

**Example Full-text Metadata**:

```json
{
  "title": "Service Agreement",
  "domain": "legal",
  "doc_type": "contract",
  "entities": ["Company A", "Company B"],
  "keywords": [
    "termination", "liability", "confidentiality",
    "jurisdiction", "effective_date", "renewal"
  ],
  "categories": ["legal", "contract", "service_agreement"],
  "extracted_fields": {
    "parties": ["Company A", "Company B"],
    "effective_date": "2024-01-01",
    "jurisdiction": "Delaware",
    "contract_value": "$100,000",
    "term": "12 months"
  },
  "content_summary": "Service agreement between Company A and Company B..."
}
```

### OpenSearch

Similar to Elasticsearch:

```bash
npx @hivellm/classify document doc.pdf \
  --output fulltext-metadata | \
  curl -X POST https://localhost:9200/documents/_doc \
    -u admin:admin \
    --insecure \
    -H "Content-Type: application/json" \
    -d @-
```

## Transmutation Integration (Document Conversion)

### Automatic Conversion

Classify automatically detects file types and calls Transmutation:

```bash
# Classify handles conversion internally
npx @hivellm/classify document report.pdf
npx @hivellm/classify document data.xlsx
npx @hivellm/classify document presentation.pptx
```

### Manual Conversion

**Pre-convert for inspection**:

```bash
# Convert to Markdown first
transmutation convert contract.pdf --output markdown > contract.md

# Classify the Markdown
npx @hivellm/classify document contract.md
```

### Programmatic Integration

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import { ClassifyClient } from '@hivellm/classify';

const execAsync = promisify(exec);
const classifyClient = new ClassifyClient({ provider: 'deepseek' });

async function convertAndClassify(filePath: string) {
  // Convert using Transmutation
  const { stdout: markdown } = await execAsync(
    `transmutation convert "${filePath}" --output markdown`
  );
  
  // Classify the converted Markdown
  const result = await classifyClient.classify(markdown, {
    sourceType: 'markdown',
    originalPath: filePath
  });
  
  return result;
}
```

### Supported Format Conversion

| Input Format | Conversion Time | Quality | Notes |
|-------------|-----------------|---------|-------|
| PDF | 0.1-1s | 80-85% | Pure Rust, 98x faster than Docling |
| DOCX | 0.05-0.5s | 85-90% | LibreOffice or Pure Rust |
| XLSX | 0.02-0.2s | 95%+ | 148 pages/second |
| PPTX | 0.01-0.1s | 90%+ | 1639 pages/second |
| HTML/XML | <0.01s | 95%+ | 2000+ pages/second |

## compression-prompt Integration (Cost Optimization)

### Automatic Compression

**Enabled by default** (50% token reduction):

```bash
# Compression enabled (default)
npx @hivellm/classify document contract.pdf

# Disable compression
npx @hivellm/classify document contract.pdf --no-compress

# Custom compression ratio
npx @hivellm/classify document contract.pdf --compression-ratio 0.3  # 70% reduction
```

### Compression Analysis

```bash
# View compression stats
npx @hivellm/classify document report.pdf --verbose

# Output:
Conversion: 450ms
Compression: 1ms
  - Original: 15,000 tokens
  - Compressed: 7,500 tokens
  - Savings: 7,500 tokens (50%)
  - Quality: 91% (estimated)
Template Selection: 587ms
Classification: 1,205ms
Total: 2,243ms
Cost: $0.0024 (saved $0.0021 via compression)
```

### Programmatic Configuration

```typescript
const client = new ClassifyClient({
  provider: 'deepseek',
  compressionEnabled: true,
  compressionRatio: 0.5,  // 50% compression
  compressionConfig: {
    preserveEntities: true,
    preserveKeywords: true,
    minWordLength: 3
  }
});
```

### Cost Savings Calculation

**Without Compression**:
- Original tokens: 15,000
- Cost (DeepSeek): $0.0045

**With 50% Compression**:
- Compressed tokens: 7,500
- Cost (DeepSeek): $0.0024
- **Savings**: $0.0021 (46.7%)

**Batch Processing (1000 documents)**:
- Original cost: $4.50
- Compressed cost: $2.40
- **Savings**: $2.10 per 1000 documents

## Combined Workflow: Graph + Full-text

### Dual Indexing Pipeline

```bash
#!/bin/bash
# dual-index.sh - Index in both Nexus and Elasticsearch

FILE=$1

# Classify document (get both outputs)
RESULT=$(npx @hivellm/classify document "$FILE" --output combined)

# Extract graph structure and index in Nexus
echo "$RESULT" | jq -r '.graph_structure.cypher' | \
  curl -X POST http://localhost:15474/cypher \
    -H "Content-Type: application/json" \
    -d @-

# Extract full-text metadata and index in Elasticsearch
echo "$RESULT" | jq '.fulltext_metadata' | \
  curl -X POST http://localhost:9200/documents/_doc \
    -H "Content-Type: application/json" \
    -d @-

echo "Indexed in both Nexus and Elasticsearch: $FILE"
```

**Usage**:

```bash
./dual-index.sh contract.pdf
./dual-index.sh invoice.xlsx
./dual-index.sh report.docx
```

### Programmatic Dual Indexing

```typescript
import { ClassifyClient } from '@hivellm/classify';
import { Client as ESClient } from '@elastic/elasticsearch';
import axios from 'axios';

const classifyClient = new ClassifyClient({ provider: 'deepseek' });
const esClient = new ESClient({ node: 'http://localhost:9200' });
const nexusClient = axios.create({ baseURL: 'http://localhost:15474' });

async function dualIndex(filePath: string) {
  // Classify once
  const result = await classifyClient.classify(filePath);
  
  const docId = result.cacheInfo.fileSha256;
  
  // Index in Nexus (graph)
  await nexusClient.post('/cypher', {
    query: result.graphStructure.cypher
  });
  
  // Index in Elasticsearch (full-text)
  await esClient.index({
    index: 'documents',
    id: docId,
    document: {
      ...result.fulltextMetadata,
      nexus_node_id: docId,
      file_path: filePath
    }
  });
  
  console.log(`Dual-indexed: ${filePath}`);
  
  return { nexusNodeId: docId, esDocId: docId };
}

// Batch dual indexing
const files = await glob('documents/**/*.{pdf,docx,xlsx}');
for (const file of files) {
  await dualIndex(file);
}
```

## Cache-Aware Batch Processing

### Progress Tracking

```bash
#!/bin/bash
# batch-with-progress.sh

DOCS_DIR="./documents"
TOTAL=$(find "$DOCS_DIR" -type f | wc -l)
CURRENT=0

for file in "$DOCS_DIR"/*; do
  ((CURRENT++))
  echo "[$CURRENT/$TOTAL] Processing: $file"
  
  npx @hivellm/classify document "$file" \
    --cache \
    --output combined \
    --verbose
done

echo "Batch complete!"
npx @hivellm/classify cache-stats
```

**Example Output**:

```
[1/100] Processing: contract1.pdf [CACHED] 2ms ✓
[2/100] Processing: contract2.pdf [NEW] 1,234ms → cached ✓
[3/100] Processing: invoice1.pdf [CACHED] 3ms ✓
[4/100] Processing: resume1.pdf [NEW] 987ms → cached ✓
...
[100/100] Processing: report99.pdf [CACHED] 2ms ✓

Batch complete!

Cache Statistics:
- Total files: 100
- Cache hits: 73 (73%)
- New classifications: 27
- Time: 45.2s (saved 1.8 hours from cache)
- Cost: $0.65 (saved $1.75)
```

### Parallel Processing

```typescript
import PQueue from 'p-queue';
import { glob } from 'glob';
import { ClassifyClient } from '@hivellm/classify';

const client = new ClassifyClient({ provider: 'deepseek' });

const queue = new PQueue({
  concurrency: 10,  // Process 10 documents simultaneously
  interval: 60000,  // Rate limit window
  intervalCap: 50   // Max 50 requests per minute
});

async function batchProcess(pattern: string) {
  const files = await glob(pattern);
  
  console.log(`Processing ${files.length} files...`);
  
  const results = await queue.addAll(
    files.map(file => async () => {
      const result = await client.classify(file);
      console.log(`✓ ${file} (${result.cacheInfo.cached ? 'CACHED' : 'NEW'})`);
      return result;
    })
  );
  
  console.log(`Processed ${results.length} files`);
  
  return results;
}

// Usage
batchProcess('documents/**/*.{pdf,docx,xlsx}');
```

## Shared Cache Across Systems

### Central Cache Server

```bash
# System A: Process files and populate cache
cd /app/system-a
export CLASSIFY_CACHE_DIR=/shared/classify-cache
npx @hivellm/classify batch ./docs --cache

# System B: Reuse cached results
cd /app/system-b
export CLASSIFY_CACHE_DIR=/shared/classify-cache
npx @hivellm/classify batch ./docs --cache
# Most files already cached!
```

### Network Cache (Future)

```typescript
// Configure remote cache
const client = new ClassifyClient({
  provider: 'deepseek',
  cacheConfig: {
    type: 'redis',
    host: 'cache.example.com',
    port: 6379,
    ttl: 2592000
  }
});
```

## Error Handling and Resilience

### Retry Strategy

```typescript
import { ClassifyClient } from '@hivellm/classify';

const client = new ClassifyClient({
  provider: 'deepseek',
  retryConfig: {
    maxAttempts: 3,
    backoffMs: 1000,
    fallbackProviders: [
      { provider: 'groq', model: 'llama-3.1-8b-instant' },
      { provider: 'openai', model: 'gpt-4o-mini' }
    ]
  }
});

try {
  const result = await client.classify('document.pdf');
} catch (error) {
  console.error('All providers failed:', error);
  // Handle failure (e.g., queue for retry later)
}
```

### Partial Results

```bash
# Continue on error
npx @hivellm/classify batch ./documents --continue-on-error

# Output:
✓ file1.pdf
✗ file2.pdf (error: timeout)
✓ file3.pdf
✓ file4.pdf
...
Summary: 97/100 success (3 errors)
```

## Monitoring and Observability

### Structured Logging

```typescript
import { ClassifyClient } from '@hivellm/classify';
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'classify.log' })]
});

const client = new ClassifyClient({
  provider: 'deepseek',
  logger: logger
});

// All operations logged:
// - Cache hits/misses
// - LLM calls
// - Errors
// - Performance metrics
```

### Metrics Export

```bash
# Export metrics to Prometheus
npx @hivellm/classify metrics export --format prometheus > metrics.txt

# Example metrics:
classify_documents_total 1234
classify_cache_hits_total 942
classify_cache_misses_total 292
classify_tokens_used_total 5100000
classify_cost_usd_total 7.14
classify_latency_ms_p95 1450
```

## Best Practices

1. **Enable Caching**: Always use cache for production (70-90% hit rate after warmup)
2. **Compression**: Keep enabled unless quality is critical
3. **Batch Processing**: Use parallel processing with rate limiting
4. **Dual Indexing**: Index in both graph and full-text for hybrid search
5. **Error Handling**: Use fallback providers for resilience
6. **Monitoring**: Track cache hit rate, latency, and cost
7. **Shared Cache**: Use centralized cache for multi-system deployments

---

**Next**: See [CONFIGURATION.md](./CONFIGURATION.md) for complete configuration options.

