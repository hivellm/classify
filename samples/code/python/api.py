"""
FastAPI REST API
Provides endpoints for user management and authentication
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
import bcrypt
import jwt
from datetime import datetime, timedelta
import asyncpg

app = FastAPI(title="User API", version="1.0.0")
security = HTTPBearer()

# Configuration
JWT_SECRET = "your-secret-key"
DATABASE_URL = "postgresql://localhost/users"


class UserCreate(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str
    name: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class UserResponse(BaseModel):
    """User response model"""
    id: int
    email: str
    name: str
    created_at: datetime


class LoginRequest(BaseModel):
    """Login request"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"


async def get_db():
    """Get database connection"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db=Depends(get_db)):
    """
    Register a new user
    
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    - **name**: User's full name
    """
    # Hash password
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    
    # Insert into database
    query = """
        INSERT INTO users (email, password, name, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, created_at
    """
    row = await db.fetchrow(query, user.email, hashed.decode(), user.name, datetime.utcnow())
    
    return UserResponse(**dict(row))


@app.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db=Depends(get_db)):
    """
    Authenticate user and return JWT token
    
    - **email**: User email
    - **password**: User password
    """
    # Find user
    query = "SELECT id, password FROM users WHERE email = $1"
    row = await db.fetchrow(query, credentials.email)
    
    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode(), row['password'].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate JWT
    payload = {
        "user_id": row['id'],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    return TokenResponse(access_token=token)


@app.get("/profile", response_model=UserResponse)
async def get_profile(user_id: int = Depends(verify_token), db=Depends(get_db)):
    """
    Get current user profile (requires authentication)
    """
    query = "SELECT id, email, name, created_at FROM users WHERE id = $1"
    row = await db.fetchrow(query, user_id)
    
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**dict(row))


@app.get("/users", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 10, db=Depends(get_db)):
    """
    List all users (paginated)
    
    - **skip**: Number of records to skip
    - **limit**: Maximum records to return
    """
    query = "SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2"
    rows = await db.fetch(query, limit, skip)
    
    return [UserResponse(**dict(row)) for row in rows]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

