/**
 * Auth Context - Global JWT token management
 * - Auto refresh tokens
 * - Persist auth state
 * - Logout functionality
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: {
    name: string;
    plan: string;
  };
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = window.location.hostname.includes('localhost')
  ? 'https://econeura-backend-v2.azurewebsites.net'
  : 'https://econeura-backend-v2.azurewebsites.net';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('econeura_token') || sessionStorage.getItem('econeura_token');
    const savedUser = localStorage.getItem('econeura_user') || sessionStorage.getItem('econeura_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Auto refresh token every 10 minutes
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      refreshToken().catch(() => {
        // Silent fail - user will need to re-login
      });
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [token]);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    
    // Save to localStorage (default) or sessionStorage
    localStorage.setItem('econeura_token', newToken);
    localStorage.setItem('econeura_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    
    localStorage.removeItem('econeura_token');
    localStorage.removeItem('econeura_user');
    sessionStorage.removeItem('econeura_token');
    sessionStorage.removeItem('econeura_user');
    
    // Call backend logout if token exists
    if (token) {
      fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => {
        // Silent fail
      });
    }
  }, [token]);

  const refreshToken = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: token })
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem('econeura_token', data.accessToken);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Don't logout automatically - just let token expire
    }
  }, [token]);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC to require authentication
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Import Navigate
import { Navigate } from 'react-router-dom';


