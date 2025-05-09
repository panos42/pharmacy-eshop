// ProductList.js - Updated with price filtering
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/productlists.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilters, setTagFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 });
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

// In ProductList.js, update the useEffect that fetches products:

useEffect(() => {
  setLoading(true);
  axios.get('http://localhost:3001/products')
    .then(res => {
      // Log the first product to check if tags are coming through
      console.log('First product data:', res.data[0]);
      
      setProducts(res.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(p => p.category))];
      setCategories(uniqueCategories);
      
      // Extract all unique tags from products
      let allTags = [];
      res.data.forEach(product => {
        // Make sure we're accessing the tags property correctly
        if (product.tags && Array.isArray(product.tags)) {
          allTags = [...allTags, ...product.tags];
        }
      });
      
      // Log the collected tags
      console.log('All extracted tags:', allTags);
      
      // Get unique tags and sort them alphabetically
      const uniqueTags = [...new Set(allTags)].sort();
      console.log('Unique tags:', uniqueTags);
      
      setAvailableTags(uniqueTags);
      
      // Calculate min and max price from all products
      if (res.data.length > 0) {
        const prices = res.data.map(p => p.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange({ min: minPrice, max: maxPrice });
        setPriceFilter({ min: minPrice, max: maxPrice });
      }
      
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
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }
    
    // Apply tag filters if any are selected
    if (tagFilters.length > 0) {
      result = result.filter(product => 
        product.tags && tagFilters.some(tag => product.tags.includes(tag))
      );
    }
    
    // Apply price filter
    result = result.filter(p => 
      p.price >= priceFilter.min && p.price <= priceFilter.max
    );
    
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
  }, [products, categoryFilter, tagFilters, searchTerm, priceFilter]);

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

  const toggleTagFilter = (tag) => {
    if (tagFilters.includes(tag)) {
      setTagFilters(tagFilters.filter(t => t !== tag));
    } else {
      setTagFilters([...tagFilters, tag]);
    }
  };

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setTagFilters([]);
    setPriceFilter(priceRange); // Reset price filter to full range
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
      
      <div className="products-container">
        {/* Left sidebar with filters */}
        <div className="filters-sidebar">
          <h2>Narrow Choices</h2>
          
          {/* Your Selections section */}
          {(categoryFilter !== 'all' || tagFilters.length > 0 || 
            priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) && (
            <div className="your-selections">
              <h3>Your Selections</h3>
              <div className="selected-filters">
                {categoryFilter !== 'all' && (
                  <div className="filter-tag">
                    {categoryFilter}
                    <button onClick={() => setCategoryFilter('all')}>✕</button>
                  </div>
                )}
                
                {tagFilters.map(tag => (
                  <div className="filter-tag" key={tag}>
                    {tag}
                    <button onClick={() => toggleTagFilter(tag)}>✕</button>
                  </div>
                ))}
                
                {(priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) && (
                  <div className="filter-tag">
                    €{priceFilter.min} - €{priceFilter.max}
                    <button onClick={() => setPriceFilter(priceRange)}>✕</button>
                  </div>
                )}
              </div>
              
              {/* <div className="filter-question">
                <p>Do these items match what you were searching for?</p>
                <div className="filter-actions">
                  <button className="btn-yes">YES</button>
                  <button className="btn-no">NO</button>
                </div>
              </div> */}
            </div>
          )}
          
          {/* Price filter */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-filter">
              <div className="price-inputs">
                <div className="price-input">
                  <label>Min €</label>
                  <input
                    type="number"
                    value={priceFilter.min}
                    onChange={(e) => setPriceFilter({...priceFilter, min: Number(e.target.value)})}
                    min={priceRange.min}
                    max={priceFilter.max}
                  />
                </div>
                <div className="price-input">
                  <label>Max €</label>
                  <input
                    type="number"
                    value={priceFilter.max}
                    onChange={(e) => setPriceFilter({...priceFilter, max: Number(e.target.value)})}
                    min={priceFilter.min}
                    max={priceRange.max}
                  />
                </div>
              </div>
              <div className="price-slider">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter({...priceFilter, min: Number(e.target.value)})}
                  className="price-range-min"
                />
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter({...priceFilter, max: Number(e.target.value)})}
                  className="price-range-max"
                />
              </div>
              <div className="price-range-values">
                <span>€{priceFilter.min}</span>
                <span>€{priceFilter.max}</span>
              </div>
              <button 
                className="apply-price-filter"
                onClick={() => setPriceFilter({...priceFilter})}
              >
                Apply
              </button>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="filter-section">
            <h3>Category</h3>
            <ul className="filter-list">
              <li>
                <label className="filter-checkbox">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryFilter === 'all'}
                    onChange={() => setCategoryFilter('all')}
                  />
                  All Categories
                </label>
              </li>
              {categories.map(category => (
                <li key={category}>
                  <label className="filter-checkbox">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === category}
                      onChange={() => setCategoryFilter(category)}
                    />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
{/* Tag filters */}
<div className="filter-section">
  <h3>Product Tags</h3>
  {availableTags.length > 0 ? (
    <ul className="filter-list">
      {availableTags.map(tag => (
        <li key={tag}>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={tagFilters.includes(tag)}
              onChange={() => toggleTagFilter(tag)}
            />
            {tag}
          </label>
        </li>
      ))}
    </ul>
  ) : (
    <p>No tags available</p>
  )}
</div>
          
          {/* Add more filter sections as needed */}
          <div className="filter-section">
            <h3>Availability</h3>
            <ul className="filter-list">
              <li>
                <label className="filter-checkbox">
                  <input type="checkbox" />
                  In Stock
                </label>
              </li>
            </ul>
          </div>
          
          {/* Clear all filters button */}
          <button className="clear-all-filters" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
        
        {/* Right side with products */}
        <div className="products-content">
          <div className="products-header">
            <div className="products-count">
              {filteredProducts.length} items found
            </div>
            <div className="products-sort">
              <label>Sort By</label>
              <select>
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
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
                    <img 
                      src={`/cached_product_images/${product.image}`}
                      alt={product.name}
                      className="product-image"
                    />
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
      </div>
    </div>
  );
};

export default ProductList;