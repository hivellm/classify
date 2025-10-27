# Project Mapping Feature

**Proposal ID:** add-project-mapping  
**Status:** Proposed  
**Priority:** High  
**Estimated Effort:** 3-5 days

## Problem Statement

Currently, classifying an entire codebase requires manually specifying each file or using basic batch processing that doesn't understand project structure. Users need an intelligent project mapper that:

- Automatically discovers source code files while ignoring build artifacts
- Understands common project structures (node_modules, target, dist, etc)
- Builds a complete project graph with file relationships
- Handles multi-language projects intelligently

## Proposed Solution

Implement a **Project Mapper** that:

1. **Smart Directory Scanning**:
   - Recursively scan project directories
   - Respect `.gitignore` patterns automatically
   - Skip common build/dependency directories (node_modules, target, dist, build, coverage, .git, etc)
   - Skip binary/compiled files (.dll, .so, .exe, .o, .class, .pyc)
   - Skip logs, data, cache directories
   - Focus only on source code and documentation

2. **Project Structure Detection**:
   - Detect project type (Node.js, Rust, Python, multi-language)
   - Identify entry points (main, index, lib, etc)
   - Map directory hierarchy
   - Detect configuration files (package.json, Cargo.toml, pyproject.toml)

3. **Intelligent Classification**:
   - Use `software_project` template automatically
   - Classify each source file
   - Build correlation graph between files
   - Extract project-level metadata

4. **Project Graph Output**:
   - Generate complete Cypher for entire project structure
   - Include file-to-file relationships (imports, dependencies)
   - Module hierarchy
   - Test coverage mapping

## Use Cases

### Use Case 1: Map TypeScript Project
```bash
classify map-project ./my-app

# Output:
# - Scans all .ts, .tsx, .js files
# - Ignores node_modules, dist, coverage
# - Builds import graph
# - Generates Cypher with all modules + relationships
```

### Use Case 2: Multi-Language Project
```bash
classify map-project ./hivellm

# Output:
# - Detects Rust (Cargo.toml), TypeScript (package.json), Python (pyproject.toml)
# - Maps each sub-project
# - Creates unified graph
```

### Use Case 3: Export to Neo4j
```bash
classify map-project ./my-app --output neo4j | cypher-shell -u neo4j -p password

# Result: Complete project structure in graph database
```

## Benefits

1. **One Command**: Map entire project structure
2. **Intelligent**: Automatically skips noise (build artifacts, dependencies)
3. **Fast**: Parallel processing with caching
4. **Actionable**: Ready-to-use Cypher for graph databases
5. **Comprehensive**: Captures all code relationships

## Success Criteria

- [ ] Respects .gitignore patterns
- [ ] Skips 20+ common artifact directories
- [ ] Maps 100+ file project in <2 minutes
- [ ] Generates valid Cypher for Neo4j
- [ ] Test coverage >80%

