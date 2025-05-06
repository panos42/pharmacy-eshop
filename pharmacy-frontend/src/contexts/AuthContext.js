// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setCurrentUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  
// In AuthContext.js
const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', { email, password });
    const { token, isAdmin } = response.data;
    
    // Store tokens
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', String(isAdmin));
    
    // Fetch user data with the token
    const userResponse = await axios.get('http://localhost:3000/auth/me', {
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
  
// Also update logout function to clear admin status
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAdmin');
  setCurrentUser(null);
};
  
  const register = async (email, password) => {
    await axios.post('http://localhost:3000/auth/register', { email, password });
  };
  
  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};