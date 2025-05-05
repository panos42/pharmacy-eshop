import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/productlists.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  // Get search query from URL
  const getSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('search') || '';
  };

  const [searchTerm, setSearchTerm] = useState(getSearchQuery);

  useEffect(() => {
    // Update search term when URL changes
    setSearchTerm(getSearchQuery());
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/products')
      .then(res => {
        setProducts(res.data);
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Apply filtering and searching
  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(p => p.category === filter);
    }
    
    // Apply search term if it exists
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower) || 
        p.category.toLowerCase().includes(searchLower) ||
        // Search in tags if they exist
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    setFilteredProducts(result);
  }, [products, filter, searchTerm]);

  const addToCart = (product) => {
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += 1; // Default to adding 1 from product list
    } else {
      // Add new item to cart
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1 // Default to quantity of 1 when adding from product list
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Provide feedback to user
    alert(`Added ${product.name} to cart!`);
  };

  if (loading) return <div className="loading-spinner">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="products-page">
      <h1>Pharmacy Products</h1>
      
      {searchTerm && (
        <div className="search-results-info">
          <p>Showing results for: <strong>{searchTerm}</strong></p>
          <button 
            className="clear-search-btn" 
            onClick={() => window.location.href = '/products'}
          >
            Clear Search
          </button>
        </div>
      )}
      
      <div className="category-filter">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={filter === category ? 'active' : ''}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products-found">
          <p>No products found matching your search criteria.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product._id}>
              <div className="product-image">
                {/* Using a placeholder image */}
                <img src={`https://placehold.co/300x200?text=${product.name}`} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">{product.price.toFixed(2)}€</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="product-tags">
                    {product.tags.map(tag => (
                      <span className="product-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <p className="product-status">
                  {product.inStock ? 
                    <span className="in-stock">In Stock</span> : 
                    <span className="out-of-stock">Out of Stock</span>
                  }
                </p>
              </div>
              <div className="product-actions">
                <Link to={`/products/${product._id}`} className="btn-details">
                  View Details
                </Link>
                <button 
                  className="btn-add-to-cart"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;