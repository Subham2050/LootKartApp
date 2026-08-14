import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './screenPages/HomePage';
import ProductPage from './screenPages/ProductPage';
import CartPage from './screenPages/CartPage';
import WishlistPage from './screenPages/WishlistPage';
import LoginPage from './screenPages/LoginPage';
import OrdersPage from './screenPages/OrdersPage';
import ToastNotification from './components/ToastNotification';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { OrderProvider } from './context/OrderContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  const triggerToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              <Router>
                <div className="App d-flex flex-column min-vh-100">
                  <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                  <main className="flex-grow-1">
                    <Routes>
                      <Route
                        path="/"
                        element={<HomePage searchTerm={searchTerm} onToast={triggerToast} />}
                      />
                      <Route
                        path="/products/:id"
                        element={<ProductPage onToast={triggerToast} />}
                      />
                      <Route path="/cart" element={<CartPage />} />
                      <Route
                        path="/wishlist"
                        element={<WishlistPage onToast={triggerToast} />}
                      />
                      <Route
                        path="/login"
                        element={<LoginPage onToast={triggerToast} />}
                      />
                      <Route path="/orders" element={<OrdersPage />} />
                    </Routes>
                  </main>
                  <Footer />

                  {/* Floating Toast Notification */}
                  <ToastNotification
                    show={toast.show}
                    message={toast.message}
                    variant={toast.variant}
                    onClose={() => setToast({ ...toast, show: false })}
                  />
                </div>
              </Router>
            </OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
