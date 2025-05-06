// OrderConfirmation.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/orderconfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Could not load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="not-found">Order not found</div>;

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <h1>Order Confirmation</h1>
        <div className="order-number">Order #{order._id}</div>
      </div>
      
      <div className="confirmation-message">
        <div className="success-icon">✓</div>
        <h2>Thank you for your order!</h2>
        <p>We've received your order and will process it shortly.</p>
      </div>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="order-items">
          {order.items.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="item-name">{item.name}</div>
              <div className="item-quantity">x{item.quantity}</div>
              <div className="item-price">{(item.price * item.quantity).toFixed(2)}€</div>
            </div>
          ))}
        </div>
        
        <div className="order-totals">
          <div className="subtotal">
            <span>Subtotal:</span>
            <span>{(order.total - 3).toFixed(2)}€</span>
          </div>
          <div className="shipping">
            <span>Shipping:</span>
            <span>3.00€</span>
          </div>
          <div className="total">
            <span>Total:</span>
            <span>{order.total.toFixed(2)}€</span>
          </div>
        </div>
      </div>
      
      <div className="next-actions">
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
        <Link to="/account/orders" className="view-orders-btn">
          View Your Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;