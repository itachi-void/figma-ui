/**
 * Example Integration Guide - How to use Account & User API Services
 * 
 * This file demonstrates how to integrate the API services and components
 * into your application routes and pages.
 */

// ============================================================================
// 1. ADD TO YOUR ROUTES FILE
// ============================================================================

import { AccountPage } from './pages/AccountPage';

// In your routes configuration:
const routes = [
  {
    path: '/account',
    element: <AccountPage />
  },
  {
    path: '/login',
    element: <LoginForm onSuccess={handleLoginSuccess} />
  },
  {
    path: '/register',
    element: <UserForm mode="create" onSuccess={handleUserCreated} />
  },
  {
    path: '/profile/:userId',
    element: <UserForm mode="edit" onSuccess={handleProfileUpdated} />
  },
  {
    path: '/users',
    element: <UsersList onEdit={handleEdit} onDelete={handleDelete} />
  }
];

// ============================================================================
// 2. STANDALONE LOGIN COMPONENT EXAMPLE
// ============================================================================

import React from 'react';
import { LoginForm } from './components/LoginForm';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (response: any) => {
    console.log('Login successful:', response);
    
    // Store auth info
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Redirect to dashboard
    navigate('/dashboard');
  };

  const handleLoginError = (error: string) => {
    console.error('Login failed:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <LoginForm 
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
}

// ============================================================================
// 3. REGISTRATION COMPONENT EXAMPLE
// ============================================================================

import React from 'react';
import { UserForm } from './components/UserForm';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();

  const handleRegistrationSuccess = (user: any) => {
    console.log('Registration successful:', user);
    
    // Show success message
    alert('Account created successfully! Please log in.');
    
    // Redirect to login
    navigate('/login');
  };

  const handleRegistrationError = (error: string) => {
    console.error('Registration failed:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <UserForm 
        mode="create"
        onSuccess={handleRegistrationSuccess}
        onError={handleRegistrationError}
      />
    </div>
  );
}

// ============================================================================
// 4. USER PROFILE EDIT EXAMPLE
// ============================================================================

import React from 'react';
import { UserForm } from './components/UserForm';
import { useParams, useNavigate } from 'react-router-dom';

export function EditProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const handleProfileUpdate = (user: any) => {
    console.log('Profile updated:', user);
    
    // Update stored user info
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect back
    navigate('/dashboard');
  };

  if (!userId) {
    return <div>Invalid user ID</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-lg mx-auto">
        <UserForm 
          userId={parseInt(userId)}
          mode="edit"
          onSuccess={handleProfileUpdate}
        />
      </div>
    </div>
  );
}

// ============================================================================
// 5. USERS MANAGEMENT PAGE EXAMPLE
// ============================================================================

import React, { useState } from 'react';
import { UsersList } from './components/UsersList';
import { Button } from './imports/button';
import { useNavigate } from 'react-router-dom';

export function UsersManagementPage() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (userId: number) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDelete = (userId: number) => {
    console.log('User deleted:', userId);
    
    // Refresh the list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Users Management</h1>
          <Button onClick={() => navigate('/register')}>
            Add New User
          </Button>
        </div>
        
        <UsersList 
          key={refreshKey}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

// ============================================================================
// 6. CUSTOM API USAGE EXAMPLE
// ============================================================================

import { userService } from './services/userService';
import { accountService } from './services/accountService';

// Using Account Service
async function customLoginHandler(email: string, password: string) {
  try {
    const response = await accountService.login({
      name: email,
      password: password,
      role: 'user'
    });

    console.log('Logged in user:', response.user);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Using User Service
async function getUserAndUpdate(userId: number) {
  try {
    // Get user
    const user = await userService.getUserById(userId);
    console.log('Current user:', user);

    // Update user
    const updated = await userService.updateUser({
      ...user,
      walletPoints: (user.walletPoints || 0) + 50
    });

    console.log('Updated user:', updated);
    return updated;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ============================================================================
// 7. CONTEXT/STORE INTEGRATION EXAMPLE (React Context)
// ============================================================================

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (name: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await accountService.login({ name, password });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }, []);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      await userService.createUser(data);
      // Auto-login after registration
      await login(data.Email, data.Password);
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage in component:
// const { user, login } = useAuth();

// ============================================================================
// 8. PROTECTED ROUTE EXAMPLE
// ============================================================================

import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const user = JSON.parse(userStr);
    if (user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}

// Usage in routes:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>

// ============================================================================
// 9. FORM WITH CUSTOM HANDLERS EXAMPLE
// ============================================================================

import React, { useState } from 'react';
import { Button } from './imports/button';
import { Input } from './imports/input';
import { userService, UserCreationData } from './services/userService';

export function CustomUserForm() {
  const [formData, setFormData] = useState<UserCreationData>({
    FullName: '',
    Email: '',
    Password: '',
    Address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await userService.createUser(formData);
      console.log('User created:', user);
      
      // Reset form
      setFormData({
        FullName: '',
        Email: '',
        Password: '',
        Address: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Full Name"
        value={formData.FullName}
        onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
      />
      <Input
        type="email"
        placeholder="Email"
        value={formData.Email}
        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Password"
        value={formData.Password}
        onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
      />
      <Input
        placeholder="Address"
        value={formData.Address}
        onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
      />
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
}

// ============================================================================
// 10. QUICK START - MINIMAL SETUP
// ============================================================================

// In your main App.tsx or routes file:
import { AccountPage } from './pages/AccountPage';

function App() {
  return (
    <Routes>
      {/* Add this single route for complete account management */}
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
}

// That's it! You now have:
// - Login page (at /account)
// - Registration page (at /account)
// - User list page (at /account)
// - Edit profile page (at /account)
