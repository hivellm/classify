"""
Authentication Test Suite
Tests for AuthService and user authentication flow
"""

import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime, timedelta
import bcrypt
import jwt

# Assuming we're testing the FastAPI app
from api import app, JWT_SECRET
from fastapi.testclient import TestClient

client = TestClient(app)


class TestAuthentication:
    """Test authentication endpoints"""

    def test_register_success(self):
        """Test successful user registration"""
        response = client.post(
            "/register",
            json={
                "email": "test@example.com",
                "password": "securepass123",
                "name": "Test User"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
        assert "password" not in data  # Password should not be returned

    def test_register_weak_password(self):
        """Test registration with weak password"""
        response = client.post(
            "/register",
            json={
                "email": "test@example.com",
                "password": "123",  # Too short
                "name": "Test User"
            }
        )
        
        assert response.status_code == 400
        assert "password" in response.json()["error"].lower()

    def test_register_missing_fields(self):
        """Test registration with missing fields"""
        response = client.post(
            "/register",
            json={"email": "test@example.com"}
        )
        
        assert response.status_code == 400

    def test_login_success(self):
        """Test successful login"""
        # First register
        client.post(
            "/register",
            json={
                "email": "login@example.com",
                "password": "securepass123",
                "name": "Login User"
            }
        )
        
        # Then login
        response = client.post(
            "/login",
            json={
                "email": "login@example.com",
                "password": "securepass123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data["data"]
        
        # Verify token is valid JWT
        token = data["data"]["token"]
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        assert "user_id" in decoded

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = client.post(
            "/login",
            json={
                "email": "nonexistent@example.com",
                "password": "wrongpass"
            }
        )
        
        assert response.status_code == 401

    def test_get_profile_authenticated(self):
        """Test getting profile with valid token"""
        # Register and login
        client.post(
            "/register",
            json={
                "email": "profile@example.com",
                "password": "securepass123",
                "name": "Profile User"
            }
        )
        
        login_response = client.post(
            "/login",
            json={
                "email": "profile@example.com",
                "password": "securepass123"
            }
        )
        
        token = login_response.json()["data"]["token"]
        
        # Get profile
        response = client.get(
            "/profile",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["email"] == "profile@example.com"
        assert data["name"] == "Profile User"

    def test_get_profile_unauthenticated(self):
        """Test getting profile without token"""
        response = client.get("/profile")
        assert response.status_code == 401

    def test_get_profile_invalid_token(self):
        """Test getting profile with invalid token"""
        response = client.get(
            "/profile",
            headers={"Authorization": "Bearer invalid-token"}
        )
        assert response.status_code == 401


class TestPasswordHashing:
    """Test password hashing and verification"""

    def test_bcrypt_hashing(self):
        """Test bcrypt password hashing"""
        password = "testpassword123"
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        
        assert hashed != password.encode()
        assert bcrypt.checkpw(password.encode(), hashed)

    def test_bcrypt_wrong_password(self):
        """Test bcrypt with wrong password"""
        password = "correctpassword"
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        
        assert not bcrypt.checkpw(b"wrongpassword", hashed)


class TestJWTTokens:
    """Test JWT token generation and verification"""

    def test_jwt_generation(self):
        """Test JWT token generation"""
        payload = {
            "user_id": 123,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        
        assert decoded["user_id"] == 123

    def test_jwt_expiration(self):
        """Test JWT token expiration"""
        payload = {
            "user_id": 123,
            "exp": datetime.utcnow() - timedelta(hours=1)  # Expired
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        
        with pytest.raises(jwt.ExpiredSignatureError):
            jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

    def test_jwt_invalid_signature(self):
        """Test JWT with wrong secret"""
        payload = {"user_id": 123}
        token = jwt.encode(payload, "wrong-secret", algorithm="HS256")
        
        with pytest.raises(jwt.InvalidSignatureError):
            jwt.decode(token, JWT_SECRET, algorithms=["HS256"])


@pytest.mark.asyncio
async def test_concurrent_requests():
    """Test concurrent authentication requests"""
    async def make_request(email):
        return client.post(
            "/register",
            json={
                "email": email,
                "password": "securepass123",
                "name": f"User {email}"
            }
        )
    
    # Create 10 concurrent requests
    tasks = [make_request(f"user{i}@example.com") for i in range(10)]
    responses = await asyncio.gather(*tasks, return_exceptions=True)
    
    # All should succeed
    assert all(r.status_code in [201, 409] for r in responses if not isinstance(r, Exception))


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

