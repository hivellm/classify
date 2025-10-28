#!/bin/bash

echo "🗑️  Clearing Elasticsearch..."
curl -X DELETE http://localhost:9200/vectorizer-docs 2>&1 | head -1

echo ""
echo "🗑️  Clearing Neo4j..."
curl -X POST http://localhost:7474/db/neo4j/tx/commit \
  -H "Content-Type: application/json" \
  -u neo4j:password \
  -d '{"statements":[{"statement":"MATCH (n) DETACH DELETE n"}]}' 2>&1 | grep -o '"errors":\[[^]]*\]'

echo ""
echo "✅ Databases cleared!"

