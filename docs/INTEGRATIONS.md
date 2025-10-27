# Database Integrations

Classify supports sending classification results to Neo4j (graph database) and Elasticsearch (full-text search) via REST APIs.

## Overview

- **Neo4j**: Stores graph structure with entities and relationships
- **Elasticsearch**: Stores fulltext metadata for search and analytics

Both integrations are **optional** and use standard HTTP REST APIs (no additional dependencies required).

## Neo4j Integration

### Configuration

Set these environment variables:

```bash
NEO4J_URL=http://localhost:7474
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
NEO4J_DATABASE=neo4j  # optional, defaults to 'neo4j'
```

### What Gets Stored

Neo4j receives the graph structure with:
- **Document node** with metadata (title, domain, docType, source_file, classified_at)
- **Entity nodes** (extracted classes, functions, modules, etc.)
- **Relationships** between document and entities

### Example Cypher

```cypher
CREATE (doc:Document {
  source_file: "typescript/database.ts",
  classified_at: datetime(),
  id: "Database Module",
  title: "Database Module",
  domain: "software",
  doc_type: "code_documentation"
})
CREATE (e0:Module {name: "pg"})
CREATE (doc)-[:MENTIONS]->(e0)
```

### REST API Endpoint

```
POST http://localhost:7474/db/neo4j/tx/commit
Authorization: Basic base64(username:password)
Content-Type: application/json

{
  "statements": [
    {
      "statement": "CREATE (doc:Document {...}) ..."
    }
  ]
}
```

## Elasticsearch Integration

### Configuration

Set these environment variables:

```bash
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=classify-documents  # optional, default
```

**Authentication** (choose one):

```bash
# Option 1: Basic Auth
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=your-password

# Option 2: API Key
ELASTICSEARCH_API_KEY=your-api-key
```

### What Gets Stored

Elasticsearch receives fulltext metadata:

```json
{
  "title": "Database Module",
  "domain": "software",
  "docType": "code_documentation",
  "keywords": ["database", "postgresql", "connection"],
  "summary": "Database connection and query utilities...",
  "extractedFields": {
    "language": "TypeScript",
    "framework": "Node.js"
  },
  "sourceFile": "typescript/database.ts",
  "classifiedAt": "2025-01-28T10:30:00.000Z",
  "classification": {
    "template": "software_project",
    "confidence": 0.95
  }
}
```

### Index Mapping

The index is created automatically with this mapping:

```json
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "domain": { "type": "keyword" },
      "docType": { "type": "keyword" },
      "keywords": { "type": "keyword" },
      "summary": { "type": "text" },
      "extractedFields": { "type": "object" },
      "sourceFile": { "type": "keyword" },
      "classifiedAt": { "type": "date" },
      "classification": {
        "properties": {
          "template": { "type": "keyword" },
          "confidence": { "type": "float" }
        }
      }
    }
  }
}
```

### REST API Endpoints

**Bulk Insert:**
```
POST http://localhost:9200/_bulk?refresh=true
Content-Type: application/x-ndjson

{"index":{"_index":"classify-documents"}}
{"title":"...","domain":"..."}
{"index":{"_index":"classify-documents"}}
{"title":"...","domain":"..."}
```

## Usage

### In Scripts

```typescript
import { Neo4jClient, ElasticsearchClient } from '@hivellm/classify';

// Initialize clients
const neo4j = new Neo4jClient({
  url: 'http://localhost:7474',
  username: 'neo4j',
  password: 'password',
});

const elasticsearch = new ElasticsearchClient({
  url: 'http://localhost:9200',
  index: 'classify-documents',
});

await neo4j.initialize();
await elasticsearch.initialize();

// Insert single result
await neo4j.insertResult(classifyResult, 'path/to/file.ts');
await elasticsearch.insertResult(classifyResult, 'path/to/file.ts');

// Insert batch
await neo4j.insertBatch(results);
await elasticsearch.insertBatch(results);

// Cleanup
await neo4j.close();
await elasticsearch.close();
```

### Using classify-samples Script

The `samples/scripts/classify-samples.ts` script automatically detects and uses configured databases:

```bash
# Set environment variables
export NEO4J_URL=http://localhost:7474
export NEO4J_USERNAME=neo4j
export NEO4J_PASSWORD=password

export ELASTICSEARCH_URL=http://localhost:9200
export ELASTICSEARCH_USERNAME=elastic
export ELASTICSEARCH_PASSWORD=password

# Run script
npx tsx samples/scripts/classify-samples.ts
```

Output:
```
╔═══════════════════════════════════════════════════╗
║  Classifying Code Samples for ES + Neo4j         ║
╚═══════════════════════════════════════════════════╝

🔵 Initializing Neo4j client...
✅ Connected to Neo4j

🟢 Initializing Elasticsearch client...
✅ Connected to Elasticsearch
✅ Created index: classify-documents

... classification progress ...

╔═══════════════════════════════════════════════════╗
║  Sending to Databases                             ║
╚═══════════════════════════════════════════════════╝

🔵 Sending to Neo4j...
   ✅ Inserted 20 documents into Neo4j

🟢 Sending to Elasticsearch...
   ✅ Indexed 20 documents in Elasticsearch

✅ Data sent to:
   🔵 Neo4j: 20 documents
   🟢 Elasticsearch: 20 documents
```

## Querying

### Neo4j Queries

```cypher
// Find all documents
MATCH (d:Document) RETURN d LIMIT 10

// Find documents by domain
MATCH (d:Document {domain: "software"}) RETURN d

// Find entities mentioned in a document
MATCH (d:Document {source_file: "typescript/database.ts"})-[:MENTIONS]->(e)
RETURN d, e

// Find documents mentioning a specific entity
MATCH (d:Document)-[:MENTIONS]->(e {name: "React"})
RETURN d.title, d.source_file
```

### Elasticsearch Queries

```bash
# Search by text
curl -X POST "localhost:9200/classify-documents/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "summary": "database connection"
    }
  }
}'

# Filter by domain
curl -X POST "localhost:9200/classify-documents/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "term": {
      "domain": "software"
    }
  }
}'

# Aggregate by docType
curl -X POST "localhost:9200/classify-documents/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "by_type": {
      "terms": {
        "field": "docType"
      }
    }
  }
}'
```

## Error Handling

Both integrations gracefully handle failures:

- If database connection fails during initialization, a warning is shown and the script continues
- If insert fails, an error is logged but doesn't stop the classification process
- Connections are properly closed even if errors occur

## Docker Setup

### Neo4j

```bash
docker run \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  -d neo4j:latest
```

### Elasticsearch

```bash
docker run \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -d elasticsearch:8.11.0
```

## See Also

- [Neo4j HTTP API Documentation](https://neo4j.com/docs/http-api/current/)
- [Elasticsearch REST APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)
- [Classification Pipeline](./ARCHITECTURE.md)

