# Implementation Tasks - Project Mapping Feature

## 1. Directory Scanner ⏳ PENDING

### 1.1 GitIgnore Parser
- [ ] Parse .gitignore files in project root
- [ ] Support .gitignore syntax (glob patterns, negations, comments)
- [ ] Cascade .gitignore from parent directories
- [ ] Test with various .gitignore patterns

### 1.2 Smart File Filter
- [ ] Create default ignore list (node_modules, target, dist, build, coverage, .git, etc)
- [ ] Filter binary files (.dll, .so, .exe, .o, .class, .pyc, .wasm)
- [ ] Filter logs and data (*.log, *.db, *.sqlite, data/, logs/, tmp/)
- [ ] Filter IDE files (.idea, .vscode, .vs, *.swp)
- [ ] Keep only source code extensions (.ts, .js, .py, .rs, .java, .go, .md, .json, .yml)

### 1.3 Project Structure Detector
- [ ] Detect Node.js projects (package.json)
- [ ] Detect Rust projects (Cargo.toml)
- [ ] Detect Python projects (pyproject.toml, setup.py, requirements.txt)
- [ ] Detect multi-language projects
- [ ] Identify entry points (index.ts, main.rs, __init__.py)

### 1.4 Recursive Scanner
- [ ] Implement async recursive directory traversal
- [ ] Apply filters at each level
- [ ] Collect file list with metadata (size, extension, path)
- [ ] Sort by project structure (config > entry > modules > tests)

## 2. Project Mapper ⏳ PENDING

### 2.1 Project Analyzer
- [ ] Create ProjectMapper class
- [ ] Analyze project structure (directories, modules)
- [ ] Build project metadata (name, type, languages, entry points)
- [ ] Identify configuration files

### 2.2 Parallel Classification
- [ ] Classify files in parallel (use BatchProcessor)
- [ ] Higher concurrency for project mapping (8-16 threads)
- [ ] Progress reporting per file
- [ ] Aggregate results

### 2.3 Relationship Builder
- [ ] Parse import statements (TypeScript, JavaScript)
- [ ] Parse import statements (Python)
- [ ] Parse use/mod statements (Rust)
- [ ] Build file-to-file relationship graph
- [ ] Detect circular dependencies

### 2.4 Project-Level Aggregation
- [ ] Aggregate entities across all files
- [ ] Build module hierarchy
- [ ] Map test files to source files
- [ ] Calculate project statistics (total entities, relationships, files)

## 3. CLI Command ⏳ PENDING

### 3.1 Map Command
- [ ] Implement `classify map-project <directory>` command
- [ ] Options: --concurrency, --ignore, --include-tests, --output
- [ ] Default output: combined (Cypher + JSON)
- [ ] Progress bar showing files processed

### 3.2 Output Formatters
- [ ] Generate project-level Cypher (all files + relationships)
- [ ] Generate project summary JSON
- [ ] Export as unified graph
- [ ] Option to split by module

## 4. Testing ⏳ PENDING

### 4.1 Unit Tests
- [ ] Test .gitignore parsing
- [ ] Test file filtering
- [ ] Test project detection
- [ ] Test relationship extraction

### 4.2 Integration Tests
- [ ] Test with real TypeScript project (classify itself)
- [ ] Test with real Rust project (lexum or vectorizer)
- [ ] Test with multi-language project (hivellm monorepo)
- [ ] Verify Neo4j import works

### 4.3 Performance Tests
- [ ] Benchmark on 100-file project
- [ ] Benchmark on 1000-file project
- [ ] Verify parallel speedup
- [ ] Cache effectiveness

## 5. Documentation ⏳ PENDING

### 5.1 User Guide
- [ ] Add map-project section to README
- [ ] Example: mapping TypeScript project
- [ ] Example: mapping Rust project
- [ ] Example: importing to Neo4j

### 5.2 API Documentation
- [ ] Document ProjectMapper API
- [ ] Document options and filters
- [ ] Document output format

---

## Success Criteria

- [ ] Maps classify project (50+ files) in <1 minute
- [ ] Correctly ignores node_modules, dist, coverage
- [ ] Generates valid Cypher for Neo4j
- [ ] Imports successfully to Neo4j
- [ ] Test coverage >80%
- [ ] Documentation complete

---

## Timeline

**Estimated:** 3-5 days  
**Dependencies:** None (uses existing BatchProcessor and software_project template)

