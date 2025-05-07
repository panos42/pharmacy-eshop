// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('[AuthContext] initial token:', token);
  
      if (token) {
        try {
          const res = await axios.get('http://localhost:3001/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('[AuthContext] /auth/me →', res.data);
          setCurrentUser(res.data);
        } catch (err) {
          console.error('[AuthContext] /auth/me failed →', err.response?.status);
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
        }
      }
  
      setLoading(false);
    };
  
    checkAuth();
  }, []);
  
  
  
  // Login function with better error handling
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password });
      const { token, isAdmin } = response.data;
      
      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', String(isAdmin));
      
      // Fetch user data with the token
      const userResponse = await axios.get('http://localhost:3001/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create complete user object
      const user = {
        ...userResponse.data,
        isAdmin,
        _id: userResponse.data._id || userResponse.data.id // Handle different response formats
      };
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function that properly clears everything
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setCurrentUser(null);
  };
  
  const register = async (email, password) => {
    await axios.post('http://localhost:3001/auth/register', { email, password });
  };
  
  // Function to check if user is authenticated - use this across components
  const isAuthenticated = () => {
    // Check both the token and currentUser
    return !!localStorage.getItem('token');
  };
  
  // Function to refresh user data from the server if needed
  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    console.log('[AuthContext] refreshUserData token:', token);
    if (!token) return null;
  
    try {
      const res = await axios.get('http://localhost:3001/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[AuthContext] refreshUserData →', res.data);
      const user = {
        ...res.data,
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        _id: res.data._id || res.data.id
      };
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('[AuthContext] refreshUserData failed →', err.response?.status);
      if (err.response?.status === 401) logout();
      return null;
    }
  };
  
  
  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated,
    refreshUserData,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};