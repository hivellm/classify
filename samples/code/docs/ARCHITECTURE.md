# System Architecture

## Overview

Multi-tier architecture with React frontend, Node.js/Python backend, PostgreSQL database, and Rust vector database.

## Components

### Frontend Layer
```
React App (App.jsx)
├── Authentication (useAuth hook)
├── User Interface Components
│   ├── LoginForm
│   ├── Dashboard
│   └── UserList
└── API Client (fetch)
```

### API Layer
```
Express.js Server (server.js)
├── Routes
│   ├── POST /api/register
│   ├── POST /api/login
│   ├── GET /api/profile
│   └── GET /api/users
├── Middleware
│   ├── Authentication (JWT verify)
│   ├── Rate Limiting
│   └── Error Handling
└── Controllers (UserController.ts)
```

### Service Layer
```
TypeScript Services
├── AuthService.ts
│   ├── register()
│   ├── login()
│   ├── verifyToken()
│   └── changePassword()
├── UserService.ts
│   ├── getProfile()
│   ├── updateProfile()
│   └── deleteUser()
└── Database.ts (connection pool)
```

### Data Layer
```
PostgreSQL
├── users table
│   ├── id (PK)
│   ├── email (UNIQUE)
│   ├── password (hashed)
│   ├── name
│   └── created_at
└── sessions table
    ├── id (PK)
    ├── user_id (FK)
    ├── token
    └── expires_at
```

### Vector Search Layer
```
Rust Vector DB (lib.rs)
├── Storage (storage.rs)
├── HNSW Index
├── HTTP Handler (handler.rs)
│   ├── POST /vectors (insert)
│   ├── POST /search (similarity)
│   └── DELETE /vectors/:id
└── Models (model.rs)
```

### Data Processing
```
Python Pipeline (process_data.py)
├── Load Data (CSV/JSON)
├── Generate Embeddings (SentenceTransformers)
└── Upload to Vector DB
```

## Data Flow

### User Registration
```
1. Client (React) → POST /api/register
2. Server validates input
3. AuthService hashes password (bcrypt)
4. Database stores user
5. Response with user data
```

### Authentication
```
1. Client → POST /api/login
2. Server finds user by email
3. AuthService verifies password (bcrypt.compare)
4. Generate JWT token (24h expiry)
5. Response with token
6. Client stores token (localStorage)
```

### Authenticated Request
```
1. Client → GET /api/profile (+ Auth header)
2. Middleware verifies JWT token
3. Extract user ID from token
4. Database query user data
5. Response with profile
```

### Vector Search
```
1. Python processes documents
2. Generate embeddings (MiniLM)
3. Upload to Rust Vector DB
4. Client searches via POST /search
5. HNSW returns k-nearest neighbors
6. Results with similarity scores
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + JSX | User interface |
| API | Express.js | REST endpoints |
| Services | TypeScript | Business logic |
| Database | PostgreSQL | User data |
| Vector DB | Rust + HNSW | Semantic search |
| Processing | Python | Data pipeline |
| Auth | bcrypt + JWT | Security |

## Security Architecture

### Authentication Flow
```
User Credentials → bcrypt.hash → Database
Database → bcrypt.compare → JWT.sign → Client
Client → JWT token → Middleware → JWT.verify → User ID
```

### Security Layers
1. **Transport**: HTTPS (TLS 1.3)
2. **Headers**: Helmet.js security headers
3. **Rate Limiting**: 100 req/15min per IP
4. **Password**: bcrypt with 10 salt rounds
5. **Tokens**: JWT with 24h expiry
6. **Validation**: Input sanitization

## Deployment Architecture

```
┌──────────────┐
│   Nginx      │ ← Reverse proxy
├──────────────┤
│ React (SPA)  │ ← Static files
└──────┬───────┘
       │
┌──────▼───────┐
│ Express API  │ ← Node.js server
└──────┬───────┘
       │
┌──────▼───────┐
│ PostgreSQL   │ ← Persistent storage
└──────────────┘
┌──────────────┐
│ Vector DB    │ ← Rust service (port 8080)
└──────────────┘
```

## Performance Considerations

- Connection pooling (max 20 connections)
- JWT caching to avoid repeated DB lookups
- HNSW index for O(log N) vector search
- Batch embedding generation
- Async/await throughout for non-blocking I/O

## Scalability

- Horizontal: Load balance multiple API servers
- Vertical: Scale PostgreSQL with replicas
- Cache: Add Redis for session storage
- CDN: Serve static React files
- Queue: Add message queue for async tasks

