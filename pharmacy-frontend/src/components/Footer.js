// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Pharmacy Plus</h3>
          <p>Your trusted online pharmacy since 2025. We offer a wide range of healthcare products at competitive prices.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/products">Medications</Link></li>
            <li><Link to="/products">Vitamins</Link></li>
            <li><Link to="/products">Skin Care</Link></li>
            <li><Link to="/products">First Aid</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 123 Pharmacy Street, Athens</p>
          <p>📞 +30 210 1234567</p>
          <p>✉️ info@pharmacyplus.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Pharmacy Plus. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;