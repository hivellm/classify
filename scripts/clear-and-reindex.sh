#!/bin/bash

echo "🗑️  Clearing Elasticsearch..."
curl -s -X DELETE http://localhost:9200/vectorizer-docs 2>&1 | head -1

echo ""
echo "🗑️  Clearing Neo4j..."
curl -s -X POST http://localhost:7474/db/neo4j/tx/commit \
  -H "Content-Type: application/json" \
  -u neo4j:password \
  -d '{"statements":[{"statement":"MATCH (n) DETACH DELETE n"}]}' 2>&1 | python3 -c "import sys, json; data = json.load(sys.stdin); print('  Errors:', data.get('errors', []))"

echo ""
echo "✅ Databases cleared!"
echo ""
echo "🚀 Re-indexing 100 files..."
echo ""

cd /mnt/f/Node/hivellm/classify
npx tsx samples/examples/batch-vectorizer-cursor.ts

echo ""
echo "📊 Final Counts:"
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

echo ""
echo "Neo4j All Nodes:"
curl -s -X POST http://localhost:7474/db/neo4j/tx/commit \
  -H "Content-Type: application/json" \
  -u neo4j:password \
  -d '{"statements":[{"statement":"MATCH (n) RETURN count(n) as count"}]}' | \
  python3 -c "import sys, json; data = json.load(sys.stdin); print(f'  Total: {data[\"results\"][0][\"data\"][0][\"row\"][0] if data[\"results\"] and data[\"results\"][0][\"data\"] else 0}')"

echo ""
echo "✅ Done!"

