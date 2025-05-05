// ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/productdetails.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);


// In ProductDetail.js, check the useEffect section:
useEffect(() => {
  setLoading(true);
  axios.get(`http://localhost:3000/products/${id}`)
    .then(res => {
      setProduct(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching product details:', err);
      setError('Could not load product details');
      setLoading(false);
    });
}, [id]);
  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const addToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Provide feedback to user
    alert(`Added ${quantity} of ${product.name} to cart!`);
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back to Products
      </button>
      
      <div className="product-detail">
        <div className="product-image-large">
          <img src={`https://placehold.co/600x400?text=${product.name}`} alt={product.name} />
        </div>
        
        <div className="product-info-detailed">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <div className="product-price-large">{product.price.toFixed(2)}€</div>
          
          <div className="product-availability">
            {product.inStock ? 
              <span className="in-stock">✓ In Stock</span> : 
              <span className="out-of-stock">✗ Out of Stock</span>
            }
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="purchase-controls">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                disabled={!product.inStock}
              />
            </div>
            
            <button 
              className="add-to-cart-large"
              disabled={!product.inStock}
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;