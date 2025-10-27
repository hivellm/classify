# Contributing Guide

Thank you for contributing to the User Management System!

## Development Setup

### Prerequisites
- Node.js 18+ (for TypeScript and JavaScript)
- Rust 1.70+ (for vector database)
- Python 3.10+ (for data processing)
- PostgreSQL 14+
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/example/user-management.git
cd user-management

# Install dependencies
npm install
cd rust-vector-db && cargo build
cd ../python-pipeline && pip install -r requirements.txt

# Setup database
createdb users
psql users < schema.sql

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Run tests
npm test
cargo test
pytest
```

## Project Structure

```
.
├── src/
│   ├── typescript/          # TypeScript services
│   │   ├── AuthService.ts
│   │   ├── UserController.ts
│   │   └── database.ts
│   ├── javascript/          # JavaScript files
│   │   ├── App.jsx
│   │   └── server.js
│   ├── rust/                # Rust vector database
│   │   ├── lib.rs
│   │   ├── handler.rs
│   │   └── model.rs
│   └── python/              # Python pipeline
│       ├── api.py
│       └── process_data.py
├── tests/                   # Test files
├── docs/                    # Documentation
└── config/                  # Configuration files
```

## Code Style

### TypeScript/JavaScript
- Use ESLint + Prettier
- Run `npm run lint` before committing
- Follow Airbnb style guide
- Add JSDoc comments on public APIs

### Rust
- Use `rustfmt` and `clippy`
- Run `cargo fmt && cargo clippy` before committing
- Add doc comments (`///`) on public items
- Write unit tests for all functions

### Python
- Use Black formatter
- Follow PEP 8
- Add type hints
- Use docstrings for all functions

## Testing

### Run All Tests
```bash
# TypeScript
npm test

# Rust
cargo test --all-features

# Python
pytest tests/
```

### Coverage
```bash
npm run test:coverage
cargo tarpaulin
pytest --cov
```

## Pull Request Process

1. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run Tests**
   ```bash
   npm test && cargo test && pytest
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Code Review**
   - Address review comments
   - Update tests if needed
   - Squash commits if requested

## Adding New Features

### New API Endpoint

1. Add route in `server.js`
2. Create controller method in `UserController.ts`
3. Add service method if needed
4. Write integration test
5. Update `API.md` documentation

### New Database Table

1. Create migration SQL
2. Update `database.ts` with repository
3. Add TypeScript interface
4. Write tests
5. Update schema documentation

### New Vector Operation

1. Add method to `lib.rs`
2. Create HTTP handler in `handler.rs`
3. Add model in `model.rs`
4. Write unit + integration tests
5. Update API docs

## Reporting Issues

- Use GitHub Issues
- Include: Steps to reproduce, expected behavior, actual behavior
- Add logs if applicable
- Tag appropriately (bug, enhancement, question)

## Questions?

- Email: dev@example.com
- Discord: #dev-channel

