import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount (using sessionStorage)
  const loadUser = async () => {
    const token = sessionStorage.getItem('token'); // <-- CHANGED to sessionStorage
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setError(null);
    } catch (err) {
      sessionStorage.removeItem('token'); // <-- CHANGED
      setUser(null);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Register
  const register = async (userData) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', userData);
      const { token, user: userDataResponse } = res.data;
      sessionStorage.setItem('token', token); // <-- CHANGED to sessionStorage
      setUser(userDataResponse);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userDataResponse } = res.data;
      sessionStorage.setItem('token', token); // <-- CHANGED to sessionStorage
      setUser(userDataResponse);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Logout
  const logout = () => {
    sessionStorage.removeItem('token'); // <-- CHANGED to sessionStorage
    sessionStorage.removeItem('lastRoute');
    setUser(null);
    setError(null);
  };

  // Save last visited route (using sessionStorage so it clears on close)
  const saveLastRoute = (route) => {
    if (route && route !== '/' && route !== '/login' && route !== '/register') {
      sessionStorage.setItem('lastRoute', route); // <-- CHANGED to sessionStorage
    }
  };

  // Get last visited route
  const getLastRoute = () => {
    return sessionStorage.getItem('lastRoute') || null; // <-- CHANGED to sessionStorage
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    saveLastRoute,
    getLastRoute,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVendor: user?.role === 'vendor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};