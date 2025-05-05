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
  
  const login = async (email, password) => {
    const response = await axios.post('http://localhost:3000/auth/login', { email, password });
    const { token, isAdmin } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', String(isAdmin)); // Store as string
  
    const userResponse = await axios.get('http://localhost:3000/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Make sure user object includes admin status
    const user = {...userResponse.data, isAdmin};
    setCurrentUser(user);
    return user;
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
    isAuthenticated: !!currentUser
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