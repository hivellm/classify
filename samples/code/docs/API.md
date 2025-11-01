# API Documentation

REST API specification for User Management System

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### POST /register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - Validation error (missing fields, weak password)
- `409` - Email already exists
- `500` - Server error

---

### POST /login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### GET /profile

Get current user profile. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Software developer",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found
- `500` - Server error

---

### PUT /profile

Update user profile. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Senior software developer",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Smith",
    "bio": "Senior software developer"
  }
}
```

---

### POST /change-password

Change user password. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newsecurepassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
- `400` - Validation error
- `401` - Invalid current password
- `500` - Server error

---

### GET /users

List all users (paginated). **Requires authentication.**

**Query Parameters:**
- `skip` (number): Records to skip (default: 0)
- `limit` (number): Max records (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user1@example.com",
      "name": "User One",
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "name": "User Two",
      "created_at": "2025-01-02T00:00:00Z"
    }
  ],
  "total": 2
}
```

---

### DELETE /users/:id

Delete a user. **Requires admin authentication.**

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated or not admin
- `404` - User not found
- `500` - Server error

---

### GET /health

Service health check. **No authentication required.**

**Response:** `200 OK`
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-27T12:00:00Z"
}
```

## Rate Limiting

All endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Error Format

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Security

- All passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 24 hours
- HTTPS recommended for production
- CORS enabled for specified origins
- Helmet.js security headers applied

