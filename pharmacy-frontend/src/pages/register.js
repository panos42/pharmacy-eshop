// register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    isAdmin: false,
    adminSecret: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Admin validation check
    if (form.isAdmin && form.adminSecret !== 'pharmacy123') { // Use a secure secret in production
      setError('Invalid admin secret key');
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        email: form.email,
        password: form.password,
        isAdmin: form.isAdmin
      };
      
      const res = await axios.post('http://localhost:3000/auth/register', payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="isAdmin"
                checked={form.isAdmin}
                onChange={handleChange}
              />
              Register as Admin
            </label>
          </div>
          
          {form.isAdmin && (
            <div className="form-group">
              <label htmlFor="adminSecret">Admin Secret Key</label>
              <input 
                type="password" 
                id="adminSecret"
                name="adminSecret"
                value={form.adminSecret}
                onChange={handleChange}
                required={form.isAdmin}
                placeholder="Enter admin secret key pharmacy123"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}