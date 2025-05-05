// InventoryManagement.js (in components/admin folder)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    inStock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/products/${editingProduct._id}`, editingProduct);
      setProducts(products.map(p => p._id === editingProduct._id ? editingProduct : p));
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Convert price to number
      const productToAdd = {
        ...newProduct,
        price: parseFloat(newProduct.price)
      };
      
      const res = await axios.post('http://localhost:3000/products', productToAdd);
      setProducts([...products, res.data]);
      setNewProduct({
        name: '',
        price: '',
        category: '',
        description: '',
        inStock: true
      });
      alert('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Loading state
  if (loading) return <div className="loading-spinner">Loading inventory data...</div>;
  
  // Error state
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory & Logistics Management</h2>
      </div>
      
      <div className="inventory-summary">
        <div className="summary-card">
          <h3>Total Products</h3>
          <div className="summary-number">{products.length}</div>
        </div>
        <div className="summary-card">
          <h3>In Stock</h3>
          <div className="summary-number">
            {products.filter(p => p.inStock).length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Out of Stock</h3>
          <div className="summary-number">
            {products.filter(p => !p.inStock).length}
          </div>
        </div>
      </div>
      
      <div className="add-product-section">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct} className="add-product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price (€)</label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={newProduct.inStock}
                  onChange={handleNewProductChange}
                />
                In Stock
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="btn-add-product">
            Add Product
          </button>
        </form>
      </div>
      
      <div className="product-listing">
        <h3>Current Inventory</h3>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price (€)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                {editingProduct && editingProduct._id === product._id ? (
                  // Edit mode
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editingProduct.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="category"
                        value={editingProduct.category}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={editingProduct.price}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={editingProduct.inStock}
                          onChange={handleEditChange}
                        />
                        In Stock
                      </label>
                    </td>
                    <td>
                      <button className="btn-save" onClick={handleSaveEdit}>Save</button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.inStock ? 'status-in-stock' : 'status-out-of-stock'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEditProduct(product)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;