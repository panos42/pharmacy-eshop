// Navbar.js - Updated with search bar
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  useEffect(() => {
    console.log("Navbar rendered. isAdmin:", isAdmin);
    console.log("Raw localStorage value:", localStorage.getItem('isAdmin'));
  }, [isAdmin]);
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const toggleAdminDropdown = (e) => {
    e.preventDefault();
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Pharmacy Plus
        </Link>
        
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/cart" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Cart
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item nav-dropdown">
                  <span 
                    className="nav-link dropdown-toggle"
                    onClick={toggleAdminDropdown}
                  >
                    Admin {isAdminDropdownOpen ? '▲' : '▼'}
                  </span>
                  <ul className={`dropdown-menu ${isAdminDropdownOpen ? 'active' : ''}`}>
                    <li>
                      <Link to="/admin" className="dropdown-link" onClick={() => {
                        setIsMenuOpen(false);
                        setIsAdminDropdownOpen(false);
                      }}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin?tab=analytics" className="dropdown-link" onClick={() => {
                        setIsMenuOpen(false);
                        setIsAdminDropdownOpen(false);
                      }}>
                        Customer Analytics
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin?tab=inventory" className="dropdown-link" onClick={() => {
                        setIsMenuOpen(false);
                        setIsAdminDropdownOpen(false);
                      }}>
                        Inventory Management
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;