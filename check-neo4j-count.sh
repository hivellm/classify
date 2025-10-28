#!/bin/bash
curl -s -X POST http://localhost:7474/db/neo4j/tx/commit \
  -H "Content-Type: application/json" \
  -u neo4j:password \
  -d '{"statements":[{"statement":"MATCH (n:Document) RETURN count(n) as count"}]}' | python3 -c "import sys, json; data = json.load(sys.stdin); print('Neo4j Document count:', data['results'][0]['data'][0]['row'][0] if data['results'] else 'Error')"

