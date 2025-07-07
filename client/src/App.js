// src/App.js
import React from 'react';
import ProductList from './components/ProductList';
import Header from './components/Header';
import Cart from './components/Cart';
import './App.css';
import { ItemProvider } from './context/ItemContext';

const App = () => {
    return (
        <ItemProvider>
            <div className="app">
                <Header />
                <main className="main-content">
                    <ProductList />
                </main>
                <Cart />
                
                {/* Footer */}
                <footer className="footer">
                    <div className="container">
                        <div className="footer-content">
                            <div className="footer-section">
                                <h3>🛒 ShopEase</h3>
                                <p>Your one-stop destination for amazing products at great prices!</p>
                            </div>
                            <div className="footer-section">
                                <h4>Quick Links</h4>
                                <ul>
                                    <li>About Us</li>
                                    <li>Contact</li>
                                    <li>Privacy Policy</li>
                                    <li>Terms & Conditions</li>
                                </ul>
                            </div>
                            <div className="footer-section">
                                <h4>Categories</h4>
                                <ul>
                                    <li>Men's Fashion</li>
                                    <li>Women's Fashion</li>
                                    <li>Kids & Toys</li>
                                    <li>Books & Media</li>
                                </ul>
                            </div>
                            <div className="footer-section">
                                <h4>Customer Service</h4>
                                <ul>
                                    <li>📞 1800-123-4567</li>
                                    <li>📧 support@shopease.com</li>
                                    <li>🕒 24/7 Support</li>
                                    <li>💬 Live Chat</li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>&copy; 2024 ShopEase. All rights reserved. Made with ❤️</p>
                        </div>
                    </div>
                </footer>
            </div>
        </ItemProvider>
    );
};

export default App;