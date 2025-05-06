// Cart.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/cart.css';
import { useAuth } from '../contexts/AuthContext'; // Import the auth context

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading, logout } = useAuth();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    console.log('🧠 Cart mounted - Auth loading:', loading);
    console.log('👤 Current user:', currentUser);
    console.log('✅ isAuthenticated:', isLoggedIn);
  }, [loading, currentUser, isLoggedIn]);
  
  if (loading) {
    return <div>Loading authentication status...</div>;
  }
  
  // Initialize cart items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    // Wait until auth is fully loaded
    if (loading) {
      alert("Checking authentication status... Please wait.");
      return;
    }
  
    // If user is not authenticated, redirect to login
    if (!currentUser) {
      navigate('/login?redirect=checkout');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No auth token found.");
      }
  
      // Create the order
      const response = await axios.post('http://localhost:3000/orders', {
        userId: currentUser._id,
        items: cartItems,
        total: calculateTotal() + 3 // Include shipping
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Record conversion analytics
      await axios.post('http://localhost:3000/visits', {
        userId: currentUser._id,
        isConversion: true,
        source: localStorage.getItem('referrer') || 'direct'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Clear cart and redirect to order confirmation
      localStorage.removeItem('cart');
      setCartItems([]);
      navigate(`/order/${response.data._id}`);
    } catch (error) {
      console.error('Checkout error:', error);
  
      if (error.response?.status === 401) {
        // Unauthorized - likely token expired
        logout();
        navigate('/login?redirect=checkout');
      } else {
        alert('Checkout failed. Please try again.');
      }
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div className="cart-item" key={item._id}>
            <div className="item-image">
              <img src={`https://placehold.co/100x100?text=${item.name}`} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">{item.price.toFixed(2)}€</p>
            </div>
            
            <div className="item-quantity">
              <button 
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            
            <div className="item-total">
              {(item.price * item.quantity).toFixed(2)}€
            </div>
            
            <button 
              className="remove-item"
              onClick={() => removeItem(item._id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>{calculateTotal().toFixed(2)}€</span>
        </div>
        <div className="shipping">
          <span>Shipping:</span>
          <span>3.00€</span>
        </div>
        <div className="total">
          <span>Total:</span>
          <span>{(calculateTotal() + 3).toFixed(2)}€</span>
        </div>
        
        <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
        Proceed to Checkout
      </button>

        
        <Link to="/products" className="continue-shopping-link">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;