# TINY vs STANDARD Template Comparison Guide

This guide explains how to run a comprehensive comparison between TINY and STANDARD templates.

## What This Does

The comparison script:

1. ✅ Processes 20 documents with **STANDARD** templates
2. ✅ Processes the same 20 documents with **TINY** templates  
3. ✅ Indexes STANDARD results in Elasticsearch (`classify-standard` index)
4. ✅ Indexes TINY results in Elasticsearch (`classify-tiny` index)
5. ✅ Indexes STANDARD results in Neo4j (`classify` database)
6. ✅ Indexes TINY results in Neo4j (`classifytiny` database)
7. ✅ Runs search queries on both indices
8. ✅ Compares search result quality
9. ✅ Generates comprehensive comparison report

## Prerequisites

### 1. API Keys

Create `.env` file with:

```env
DEEPSEEK_API_KEY=sk-your-key-here
```

### 2. Databases (Optional but Recommended)

**Elasticsearch:**
```bash
docker run -d -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.11.0
```

**Neo4j:**
```bash
docker run -d -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest

# After Neo4j starts, create databases:
.\scripts\setup-neo4j-databases.ps1
```

## Running the Comparison

### Windows (PowerShell)

```powershell
cd F:\Node\hivellm\classify

# Step 1: Setup Neo4j databases (one-time)
.\scripts\setup-neo4j-databases.ps1

# Step 2: Run comparison
.\scripts\compare-templates.ps1
```

### Linux/Mac (WSL or Bash)

```bash
cd /mnt/f/Node/hivellm/classify
npm run build
node --loader tsx samples/scripts/compare-tiny-vs-standard.ts
```

## What to Expect

### Processing Time

- **STANDARD templates**: ~2.2s per document
- **TINY templates**: ~1.5s per document
- **Total for 20 docs**: 3-5 minutes

### Cost

- **STANDARD**: ~$0.048 (20 files × $0.0024)
- **TINY**: ~$0.014 (20 files × $0.0007)
- **Savings**: ~$0.034 (70%)

## Understanding the Results

### 1. Console Output

```
📈 COMPARISON SUMMARY

Cost Comparison:
  STANDARD: $0.0480 ($0.0024/doc)
  TINY:     $0.0140 ($0.0007/doc)
  SAVINGS:  $0.0340 (70.8%)

Processing Time:
  STANDARD: 44.0s (2.20s/doc)
  TINY:     30.0s (1.50s/doc)
  SAVINGS:  31.8%

Extraction Comparison:
  STANDARD Entities:      12.4 avg
  TINY Entities:          2.8 avg
  STANDARD Relationships: 18.6 avg
  TINY Relationships:     1.2 avg

Search Quality:
  Average Overlap: 7.2 of 10 results (72%)
  Quality Assessment: ✅ EXCELLENT
```

### 2. JSON Report

Located at: `samples/results/tiny-vs-standard-comparison.json`

**Structure:**
```json
{
  "timestamp": "2025-10-27T...",
  "summary": {
    "filesProcessed": 20,
    "standard": { "totalCost": 0.048, ... },
    "tiny": { "totalCost": 0.014, ... },
    "savings": { "cost": "70.8%", ... }
  },
  "detailedComparison": [
    {
      "file": "path/to/file.rs",
      "standard": {
        "entities": 15,
        "relationships": 22,
        "keywords": 18,
        "cost": 0.0025
      },
      "tiny": {
        "entities": 3,
        "relationships": 1,
        "keywords": 6,
        "cost": 0.0007
      },
      "savings": {
        "cost": "72%",
        "time": "35%"
      }
    }
  ],
  "searchQualityComparison": [
    {
      "query": "embedding implementation",
      "standardResults": 10,
      "tinyResults": 10,
      "qualityDiff": "80% overlap",
      "topStandardDocs": [...],
      "topTinyDocs": [...],
      "overlap": 8
    }
  ]
}
```

### 3. Elasticsearch Indices

**Query STANDARD index:**
```bash
curl http://localhost:9200/classify-standard/_search?q=embedding
```

**Query TINY index:**
```bash
curl http://localhost:9200/classify-tiny/_search?q=embedding
```

**Compare counts:**
```bash
# STANDARD
curl http://localhost:9200/classify-standard/_count

# TINY  
curl http://localhost:9200/classify-tiny/_count
```

### 4. Neo4j Graph Database

Access Neo4j Browser: `http://localhost:7474/browser/`

**Compare document counts:**
```cypher
// In 'classify' database (STANDARD)
:use classify
MATCH (d:Document) 
RETURN count(d) as count

// In 'classifytiny' database (TINY)
:use classifytiny
MATCH (d:Document) 
RETURN count(d) as count
```

**Compare entity counts:**
```cypher
// In 'classify' database (STANDARD)
:use classify
MATCH (d:Document)-[r]->() 
RETURN count(r) as relationships

// In 'classifytiny' database (TINY)
:use classifytiny
MATCH (d:Document)-[r]->() 
RETURN count(r) as relationships
```

**Compare graph complexity:**
```cypher
// STANDARD: Most connected documents
:use classify
MATCH (d:Document)-[r]->() 
RETURN d.title, count(r) as connections 
ORDER BY connections DESC 
LIMIT 5

// TINY: Most connected documents
:use classifytiny
MATCH (d:Document)-[r]->() 
RETURN d.title, count(r) as connections 
ORDER BY connections DESC 
LIMIT 5
```

**Search comparison:**
```cypher
// Find documents mentioning "embedding" in STANDARD
:use classify
MATCH (d:Document) 
WHERE d.title CONTAINS 'embedding' 
   OR any(k IN d.keywords WHERE k CONTAINS 'embedding')
RETURN d.title, d.keywords

// Same search in TINY
:use classifytiny
MATCH (d:Document) 
WHERE d.title CONTAINS 'embedding' 
   OR any(k IN d.keywords WHERE k CONTAINS 'embedding')
RETURN d.title, d.keywords
```

## Interpreting Quality Metrics

### Search Overlap Score

- **90-100%**: Nearly identical results (excellent)
- **70-89%**: High overlap (very good)
- **50-69%**: Moderate overlap (acceptable)
- **< 50%**: Low overlap (may need tuning)

### What "Good Quality" Means

✅ **TINY templates are good enough when:**
- Search overlap ≥ 70%
- Top 5 results overlap ≥ 80%
- Essential entities captured (title, type, main topic)
- Cost savings ≥ 60%

⚠️ **Consider STANDARD templates when:**
- Need detailed code-level relationships
- Require comprehensive entity extraction
- Building complex knowledge graphs
- Search overlap < 50%

## Expected Findings

Based on initial testing:

### Cost & Performance
- **70-80% cost savings** with TINY
- **25-35% faster processing**  
- **50% smaller cache files**

### Extraction
- **STANDARD**: 10-15 entities, 15-25 relationships per doc
- **TINY**: 2-3 entities, 1-2 relationships per doc
- **Reduction**: ~80% fewer entities/relationships

### Search Quality
- **Fulltext search**: 70-90% overlap (excellent)
- **Semantic search**: 75-95% overlap (excellent)
- **Top 5 results**: 80-100% overlap (excellent)

### Conclusion
TINY templates maintain search quality while drastically reducing costs. Perfect for most use cases unless detailed graph analysis is required.

## Troubleshooting

### "Elasticsearch not responding"
```bash
# Check if Elasticsearch is running
curl http://localhost:9200

# Start Elasticsearch (Docker)
docker start <elasticsearch-container-id>
```

### "Neo4j not responding"
```bash
# Check if Neo4j is running
curl http://localhost:7474

# Start Neo4j (Docker)
docker start <neo4j-container-id>
```

### "DEEPSEEK_API_KEY not set"
Create `.env` file with your API key:
```env
DEEPSEEK_API_KEY=sk-your-actual-key
```

### "Build failed"
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## Next Steps

After running the comparison:

1. ✅ Review JSON report
2. ✅ Compare search results in Elasticsearch
3. ✅ Explore graphs in Neo4j
4. ✅ Decide: TINY (cost-optimized) vs STANDARD (full extraction)
5. ✅ Update your production config accordingly

## Contact

Questions? Check:
- Main README: `../../README.md`
- Template docs: `../../templates/README.md`
- Status: `../../docs/STATUS.md`

