// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext'; // ✅ Import AuthProvider
import './styles/main.css';
import OrderDetail from './pages/OrderDetails';

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap entire app in AuthProvider */}
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
