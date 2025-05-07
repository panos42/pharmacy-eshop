// Login.js - updated to handle return paths
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const returnPath = location.state?.returnPath || '/products';
  const { refreshUserData } = useAuth(); // ✅ Add this line

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const res = await axios.post('http://localhost:3001/auth/login', form);
  
      console.log("Login response:", res.data);
  
      // Store token
      localStorage.setItem('token', res.data.token);
  
      // Store admin status
      localStorage.setItem('isAdmin', String(res.data.isAdmin));
  
      // ✅ Refresh the user context immediately after storing the token
      await refreshUserData();
  
      // Redirect based on admin status or return path
      if (res.data.isAdmin && returnPath === '/products') {
        navigate('/admin');
      } else {
        navigate(returnPath);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        {message && <div className="info-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}