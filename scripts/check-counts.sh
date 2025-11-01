#!/bin/bash

echo "📊 Database Counts:"
echo ""

echo "Elasticsearch:"
curl -s http://localhost:9200/vectorizer-docs/_count | python3 -c "import sys, json; data = json.load(sys.stdin); print(f'  Total: {data[\"count\"]}')"

echo ""
echo "Neo4j Documents (with file_hash):"
curl -s -X POST http://localhost:7474/db/neo4j/tx/commit \
  -H "Content-Type: application/json" \
  -u neo4j:password \
  -d '{"statements":[{"statement":"MATCH (n:Document) WHERE n.file_hash IS NOT NULL RETURN count(n) as count"}]}' | \
  python3 -c "import sys, json; data = json.load(sys.stdin); print(f'  Total: {data[\"results\"][0][\"data\"][0][\"row\"][0] if data[\"results\"] and data[\"results\"][0][\"data\"] else 0}')"

