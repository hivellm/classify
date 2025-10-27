# Real-World Validation with Elasticsearch & Neo4j

**Proposal ID:** add-real-world-validation  
**Status:** Proposed  
**Priority:** High  
**Estimated Effort:** 2-3 days

## Problem Statement

Templates are theoretically sound but need real-world validation. We need to:

- Test actual integration with Elasticsearch and Neo4j
- Validate search quality with real queries
- Verify template accuracy with production data
- Ensure Cypher statements execute correctly
- Validate fulltext metadata is searchable

## Proposed Solution

Create comprehensive **validation samples** using available Elasticsearch and Neo4j instances:

### 1. Sample Documents

Create 20 diverse sample documents across all 15 templates:
- 2 Legal contracts
- 2 Financial reports
- 2 HR documents
- 2 Academic papers
- 2 Software projects (code samples)
- 2 Engineering specs
- 8 documents from remaining templates

### 2. Integration Tests

**Elasticsearch Integration:**
- Index all 20 documents with fulltext metadata
- Test keyword search quality
- Test faceted search (domain, docType)
- Test named entity search (people, organizations)
- Validate summary quality
- Measure search relevance

**Neo4j Integration:**
- Import all 20 documents as Cypher
- Execute generated Cypher statements
- Verify nodes and relationships created correctly
- Test graph queries (find related entities, shortest path)
- Validate relationship accuracy
- Test complex traversals

### 3. Quality Validation

**Template Accuracy:**
- Verify entities extracted correctly
- Verify relationships make sense
- Check confidence scores correlation with quality
- Identify template weaknesses

**Search Quality:**
- Create 30 sample queries
- Measure precision@5 for Elasticsearch
- Measure recall for Neo4j graph queries
- Compare results across templates

### 4. Sample Query Suite

**Elasticsearch Queries:**
- Full-text search: "legal contracts with TechCorp"
- Faceted search: domain=legal AND docType=contract
- Named entity search: people:"John Doe"
- Date range: dates:[2024-01-01 TO 2025-12-31]
- Keyword search: keywords:("compliance" OR "audit")

**Neo4j Queries:**
- Find all entities connected to a person
- Find shortest path between two entities
- Find all documents in a domain
- Find entity co-occurrence patterns
- Find relationship chains

## Deliverables

1. **Sample Data**:
   - `samples/` directory with 20 documents
   - `samples/README.md` with document descriptions

2. **Integration Scripts**:
   - `scripts/index-elasticsearch.sh` - Index all samples
   - `scripts/index-neo4j.sh` - Import all Cypher
   - `scripts/test-elasticsearch-queries.sh` - Run test queries
   - `scripts/test-neo4j-queries.cypher` - Graph query suite

3. **Validation Reports**:
   - `validation/elasticsearch-results.md` - Search quality metrics
   - `validation/neo4j-results.md` - Graph query results
   - `validation/template-accuracy.md` - Template quality assessment

4. **Test Suite**:
   - `tests/integration/elasticsearch.test.ts` - ES integration tests
   - `tests/integration/neo4j.test.ts` - Neo4j integration tests

## Benefits

1. **Confidence**: Real-world validation proves templates work
2. **Quality Metrics**: Quantifiable search and extraction quality
3. **Examples**: Users can see actual usage
4. **Debugging**: Identify and fix template issues
5. **Documentation**: Living examples of integration

## Success Criteria

- [ ] All 20 documents index successfully in Elasticsearch
- [ ] All 20 Cypher statements execute in Neo4j
- [ ] Search precision@5 >80% for Elasticsearch
- [ ] Graph queries return expected results in Neo4j
- [ ] No Cypher syntax errors
- [ ] Template accuracy >85% (manual review)
- [ ] All integration tests passing

## Prerequisites

- Elasticsearch running (confirmed available)
- Neo4j running (confirmed available)
- Sample documents created
- classify v0.3.0 installed

