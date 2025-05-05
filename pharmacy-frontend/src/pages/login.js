// Login.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

// In Login.js - update handleSubmit function
// In Login.js - update handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const res = await axios.post('http://localhost:3000/auth/login', form);
    
    // Make sure we're getting the isAdmin value from the response
    console.log("Login response:", res.data); // Debug: check what's in the response
    
    // Store token
    localStorage.setItem('token', res.data.token);
    
    // Store admin status - make sure it's a string "true" or "false"
    localStorage.setItem('isAdmin', String(res.data.isAdmin));
    
    // Redirect based on admin status
    if (res.data.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/products');
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