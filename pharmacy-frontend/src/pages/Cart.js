// Cart.js - Updated version with proper imports and function usage
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/cart.css';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  // Get all needed functions from useAuth
  const { currentUser, loading, logout, isAuthenticated, refreshUserData } = useAuth();
  const isLoggedIn = isAuthenticated();

  // Initialize cart items from localStorage - MOVED BEFORE conditional rendering
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    console.log('🧠 Cart mounted - Auth loading:', loading);
    console.log('👤 Current user:', currentUser);
    console.log('✅ isAuthenticated:', isAuthenticated());
  }, [loading, currentUser, isAuthenticated]);
  
  if (loading) {
    return <div>Loading authentication status...</div>;
  }

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

  // Updated handleCheckout function that properly uses the auth context
  const handleCheckout = async () => {
    // Use the isAuthenticated function from useAuth
    if (!isLoggedIn) {
      navigate('/login', { state: { returnPath: '/cart' } });
      return;
    }
    
    try {
      // We may have currentUser, but if not, refresh from server
      let userId = currentUser?._id;
      
      if (!userId) {
        const userData = await refreshUserData();
        if (!userData) {
          navigate('/login', { state: { returnPath: '/cart' } });
          return;
        }
        userId = userData._id;
      }

      // Now proceed with order creation
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/orders', {
        userId,
        items: cartItems.map(item => ({
          productId: item._id, // this must be present and valid
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: calculateTotal() + 3 // shipping or tax
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      

      // Record conversion analytics
      await axios.post('http://localhost:3001/visits', {
        userId: userId,
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
        // Token expired, redirect to login
        logout();
        navigate('/login', { state: { returnPath: '/cart' } });
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
        
        <button className="checkout-button" onClick={handleCheckout}>
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