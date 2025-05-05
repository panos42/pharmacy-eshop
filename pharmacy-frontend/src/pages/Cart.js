// Cart.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/cart.css';

const Cart = () => {
  // This would ideally come from context or Redux
 // In Cart.js, update your useState initialization:
const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
});

// And update the removeItem function:
const removeItem = (id) => {
  const updatedCart = cartItems.filter(item => item._id !== id);
  setCartItems(updatedCart);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

// And update the updateQuantity function:
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
        
        <button className="checkout-button">
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