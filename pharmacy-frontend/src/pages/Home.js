// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Your Health, Our Priority</h1>
          <p>Browse our wide range of pharmacy products for all your healthcare needs</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>
      
      <section className="featured-categories">
        <h2>Popular Categories</h2>
        <div className="category-cards">
          <div className="category-card">
            <img src="https://placehold.co/300x200?text=Pain+Relief" alt="Pain Relief" />
            <h3>Pain Relief</h3>
            <Link to="/products">View Products</Link>
          </div>
          <div className="category-card">
            <img src="https://placehold.co/300x200?text=Vitamins" alt="Vitamins" />
            <h3>Vitamins & Supplements</h3>
            <Link to="/products">View Products</Link>
          </div>
          <div className="category-card">
            <img src="https://placehold.co/300x200?text=Skin+Care" alt="Skin Care" />
            <h3>Skin Care</h3>
            <Link to="/products">View Products</Link>
          </div>
        </div>
      </section>
      
      <section className="benefits">
        <div className="benefit">
          <div className="benefit-icon">🚚</div>
          <h3>Free Delivery</h3>
          <p>On orders over 30€</p>
        </div>
        <div className="benefit">
          <div className="benefit-icon">⏱️</div>
          <h3>Same-Day Dispatch</h3>
          <p>For orders before 2pm</p>
        </div>
        <div className="benefit">
          <div className="benefit-icon">💊</div>
          <h3>Pharmacist Support</h3>
          <p>Expert advice available</p>
        </div>
      </section>
    </div>
  );
};

export default Home;