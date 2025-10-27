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

### 1. Sample Documents (Focus: Source Code)

Create 20 source code files and documentation samples:
- **10 Source Code Files**:
  - 3 TypeScript modules (different patterns: service, component, util)
  - 3 Rust modules (different patterns: lib, handler, model)
  - 2 Python scripts (API + data processing)
  - 2 JavaScript files (React component, Node.js server)
  
- **5 Project Documentation**:
  - README.md (project overview)
  - API.md (REST API documentation)
  - CONTRIBUTING.md (developer guide)
  - ARCHITECTURE.md (system design)
  - CHANGELOG.md (version history)
  
- **5 Configuration & Scripts**:
  - package.json (Node.js dependencies)
  - Cargo.toml (Rust dependencies)
  - docker-compose.yml (deployment)
  - build.sh (build script)
  - test.py (test suite)

### 2. Integration Tests

**Elasticsearch Integration (Code-Focused):**
- Index all 20 code files with fulltext metadata
- Search for functions by name
- Search for modules by purpose
- Find files importing specific dependencies
- Search code by keywords (async, database, api, etc)
- Find documentation mentioning specific modules
- Validate code summary quality

**Neo4j Integration (Code Graph):**
- Import all 20 files as Cypher (complete code graph)
- Execute generated Cypher statements
- Verify code entities: Module, Function, Class, Dependency, API
- Test import relationships (IMPORTS, DEPENDS_ON)
- Find all dependencies of a module
- Find all functions in a module (CONTAINS)
- Trace dependency chains
- Find which tests cover which modules
- Find documentation for specific code components

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

**Elasticsearch Queries (Code Search):**
- Find functions by name: "authenticate" OR "login"
- Find modules using dependency: "bcrypt" OR "jwt"
- Find async functions: keywords:"async"
- Find API endpoints: keywords:"endpoint" OR "route"
- Find database access: keywords:"database" OR "query"
- Find TypeScript modules: language:"typescript"
- Find test files: docType:"test"
- Find documentation for module: title:"AuthService"

**Neo4j Queries (Code Graph):**
- Find all modules importing "bcrypt": `MATCH (m:Module)-[:IMPORTS]->(d:Dependency {name: "bcrypt"}) RETURN m`
- Find all functions in a module: `MATCH (m:Module {name: "AuthService"})-[:CONTAINS]->(f:Function) RETURN f`
- Find dependency chain: `MATCH path=(m:Module)-[:DEPENDS_ON*1..3]->(d:Dependency) RETURN path`
- Find which tests cover a module: `MATCH (t:Test)-[:TESTS]->(m:Module {name: "AuthService"}) RETURN t`
- Find all API endpoints in project: `MATCH (m:Module)-[:EXPOSES]->(a:API) RETURN m, a`
- Find modules accessing database: `MATCH (m:Module)-[:ACCESSES]->(db:Database) RETURN m, db`
- Find circular dependencies: `MATCH path=(m:Module)-[:IMPORTS*2..5]->(m) RETURN path`
- Find documentation for code: `MATCH (d:Documentation)-[:DOCUMENTS]->(m:Module) RETURN d, m`

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

