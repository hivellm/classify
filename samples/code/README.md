# Code Samples for Classification Testing

**Purpose:** Validate `software_project` template with real code integration (Elasticsearch + Neo4j)

## Sample Files (20 Total)

### Source Code (10 files)

#### TypeScript (3 files)
1. **AuthService.ts** - Authentication service with bcrypt + JWT
   - **Entities**: Module (AuthService), Class, 4 Functions, 2 Dependencies (bcrypt, jwt)
   - **Relationships**: IMPORTS (bcrypt, jwt, User, Database), CONTAINS (functions)

2. **UserController.ts** - REST API controller
   - **Entities**: Module (UserController), Class, 6 Functions (register, login, etc)
   - **Relationships**: IMPORTS (express, AuthService, UserService), CALLS (authService methods)

3. **database.ts** - PostgreSQL connection pool
   - **Entities**: Module (Database), 2 Classes (UserRepository, SessionRepository), 8 Functions
   - **Relationships**: IMPORTS (pg), CONTAINS (repositories), ACCESSES (Database)

#### Rust (3 files)
4. **lib.rs** - Vector database library
   - **Entities**: Module (VectorDB), Struct (VectorDB), 6 Functions, 2 Dependencies (hnsw, serde)
   - **Relationships**: IMPORTS (storage, handler, model), CONTAINS (functions)

5. **handler.rs** - HTTP request handlers
   - **Entities**: Module (handler), 5 Functions (insert, search, delete, health, stats), API endpoints
   - **Relationships**: IMPORTS (axum, VectorDB, model), EXPOSES (5 APIs)

6. **model.rs** - Data models and validation
   - **Entities**: Module (model), 4 Structs, 4 Functions, 2 Dependencies (serde, validator)
   - **Relationships**: IMPORTS (serde, validator), Tests (2 unit tests)

#### Python (2 files)
7. **api.py** - FastAPI REST API
   - **Entities**: Module (api), API (FastAPI app), 5 Functions (register, login, profile, list, get_db)
   - **Relationships**: IMPORTS (fastapi, bcrypt, jwt, asyncpg), EXPOSES (5 APIs)

8. **process_data.py** - Data processing pipeline
   - **Entities**: Module (processor), Class (DataProcessor), 4 Functions, 3 Dependencies
   - **Relationships**: IMPORTS (pandas, numpy, sentence_transformers, httpx), CALLS (upload_to_vectordb)

#### JavaScript (2 files)
9. **App.jsx** - React application component
   - **Entities**: Module (App), 2 Functions (App, ProfileView), Dependencies (react, useAuth)
   - **Relationships**: IMPORTS (react, hooks, components)

10. **server.js** - Express.js server
    - **Entities**: Module (server), 6 Functions (endpoints), API (Express app), Dependencies (express, pg, bcrypt, jwt)
    - **Relationships**: IMPORTS (express, pg, bcrypt, jwt), EXPOSES (6 APIs), ACCESSES (Database)

### Documentation (5 files)

11. **README.md** - Project overview and quick start
    - **Entities**: Documentation, 4 sections (Features, Stack, Quick Start, Architecture)
    - **Relationships**: DOCUMENTS (entire project)

12. **API.md** - REST API specification
    - **Entities**: Documentation, 8 API endpoints documented
    - **Relationships**: DOCUMENTS (API endpoints in server.js, api.py)

13. **ARCHITECTURE.md** - System architecture
    - **Entities**: Documentation, Architecture diagrams, 5 layers
    - **Relationships**: DOCUMENTS (system design, all modules)

14. **CONTRIBUTING.md** - Developer guide
    - **Entities**: Documentation, Development guidelines, Code style rules
    - **Relationships**: DOCUMENTS (development process)

15. **CHANGELOG.md** - Version history
    - **Entities**: Documentation, 4 versions (0.9.0 → 1.2.0)
    - **Relationships**: DOCUMENTS (project history)

### Configuration (5 files)

16. **package.json** - Node.js dependencies
    - **Entities**: Configuration, 20 Dependencies (express, bcrypt, jwt, react, etc)
    - **Relationships**: DEPENDS_ON (all npm packages)

17. **Cargo.toml** - Rust dependencies
    - **Entities**: Configuration, 15 Dependencies (axum, tokio, hnsw, serde, etc)
    - **Relationships**: DEPENDS_ON (all cargo crates)

18. **docker-compose.yml** - Multi-service deployment
    - **Entities**: Configuration, 6 Services (postgres, api, vector-db, processor, frontend, nginx)
    - **Relationships**: DEPENDS_ON (service dependencies)

19. **build.sh** - Build automation script
    - **Entities**: Script, 4 build stages (TypeScript, Rust, Python, React)
    - **Relationships**: BUILDS (all modules)

20. **test_auth.py** - Test suite
    - **Entities**: Test, 10 test cases
    - **Relationships**: TESTS (api.py authentication)

## Expected Classification Results

### Entity Types
- **Module**: 10 (AuthService, UserController, database, lib, handler, model, api, processor, App, server)
- **Function**: ~40 total across all files
- **Class**: ~6 (AuthService, UserController, Database, UserRepository, VectorDB, DataProcessor)
- **Dependency**: ~30 (bcrypt, jwt, express, pg, axum, tokio, fastapi, etc)
- **API**: ~15 endpoints
- **Database**: 2 (PostgreSQL, Vector DB)
- **Test**: ~10 test cases
- **Script**: 1 (build.sh)
- **Documentation**: 5
- **Configuration**: 4

### Relationship Types
- **IMPORTS**: ~50 (all import statements)
- **DEPENDS_ON**: ~30 (package dependencies)
- **CALLS**: ~20 (function calls)
- **CONTAINS**: ~40 (modules containing functions)
- **IMPLEMENTS**: ~5 (class implementations)
- **TESTS**: ~10 (test coverage)
- **DOCUMENTS**: ~15 (documentation references)
- **ACCESSES**: ~8 (database access)
- **EXPOSES**: ~15 (API endpoints)
- **BUILDS**: ~4 (build script targets)

**Total Expected**:
- **~120 entities**
- **~200 relationships**

## Usage

```bash
# Classify all samples
cd /path/to/classify
node scripts/classify-samples.js

# Index in Elasticsearch
node scripts/index-elasticsearch.js

# Import to Neo4j
node scripts/import-neo4j.js

# Run validation queries
node scripts/validate-search.js
```

## Validation Queries

See `../scripts/` directory for:
- `elasticsearch-queries.json` - 30 search queries
- `neo4j-queries.cypher` - 25 graph queries
- `validate-results.js` - Automated validation

## Expected Outcomes

1. **Elasticsearch**: Should find code by function name, dependencies, keywords
2. **Neo4j**: Should map complete code graph with imports and dependencies
3. **Template Accuracy**: >85% entity extraction accuracy
4. **Search Quality**: >80% precision@5 for code search

