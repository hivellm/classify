# User Management System

A full-stack user authentication and management system with REST API and React frontend.

## Features

- ✅ User registration and authentication
- ✅ JWT-based authorization
- ✅ Password hashing with bcrypt
- ✅ PostgreSQL database
- ✅ REST API with Express.js
- ✅ React frontend with hooks
- ✅ Vector database integration
- ✅ Data processing pipeline

## Tech Stack

### Backend
- **TypeScript**: AuthService, UserController, Database
- **Node.js**: Express.js server
- **PostgreSQL**: User data storage
- **bcrypt**: Password hashing
- **JWT**: Token-based authentication

### Frontend
- **React**: UI components
- **JavaScript**: Client-side logic

### Data Processing
- **Python**: FastAPI + data processing
- **Pandas**: Data manipulation
- **SentenceTransformers**: Text embeddings

### Vector Database
- **Rust**: High-performance vector search
- **HNSW**: Approximate nearest neighbor
- **Axum**: HTTP server framework

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
createdb users
psql users < schema.sql

# Start server
npm run dev

# Start frontend
npm run dev:client
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login and get JWT token
- `GET /api/profile` - Get user profile (auth required)
- `PUT /api/profile` - Update profile (auth required)
- `POST /api/change-password` - Change password (auth required)

### Users
- `GET /api/users` - List users (paginated)
- `DELETE /api/users/:id` - Delete user (admin only)

### Health
- `GET /api/health` - Service health check

## Architecture

```
┌─────────────┐
│   React UI  │
└──────┬──────┘
       │ HTTP
┌──────▼──────┐
│ Express API │
└──────┬──────┘
       │ SQL
┌──────▼──────┐
│ PostgreSQL  │
└─────────────┘
```

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 24 hours
- Rate limiting on all endpoints
- Helmet.js for security headers
- Input validation with Pydantic/validator

## License

MIT

