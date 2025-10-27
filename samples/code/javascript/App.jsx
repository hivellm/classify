import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { UserList } from './components/UserList';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';

/**
 * Main Application Component
 * Handles authentication flow and routing
 */
export function App() {
  const { user, login, logout, isLoading } = useAuth();
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      setView('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    logout();
    setView('login');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-container">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management System</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={view === 'users' ? 'active' : ''}
          onClick={() => setView('users')}
        >
          Users
        </button>
        <button
          className={view === 'profile' ? 'active' : ''}
          onClick={() => setView('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="app-main">
        {view === 'dashboard' && <Dashboard user={user} />}
        {view === 'users' && <UserList />}
        {view === 'profile' && <ProfileView user={user} />}
      </main>
    </div>
  );
}

/**
 * Profile View Component
 * Displays and allows editing of user profile
 */
function ProfileView({ user }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
  });

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="profile-view">
      <h2>User Profile</h2>
      
      {editing ? (
        <div className="profile-form">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
          />
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Bio"
            rows={4}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-display">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio || 'No bio provided'}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default App;

