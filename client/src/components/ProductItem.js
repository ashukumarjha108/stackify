// src/components/ProductItem.js
import React, { useContext, useState } from 'react';
import { ItemContext } from '../context/ItemContext';

const ProductItem = ({ product, onBuyNow }) => { // <-- added onBuyNow
    const { addToCart, user } = useContext(ItemContext);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showBuyNow, setShowBuyNow] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleBuyNow = () => {
        if (!user) {
            alert('Please sign in to make a purchase');
            return;
        }

        if (onBuyNow) {
            onBuyNow(product); // <-- call parent handler if available
        } else {
            setShowBuyNow(true); // fallback to internal modal
        }
    };

    const handleQuickBuy = (e) => {
        e.preventDefault();
        alert(`Order placed for ${product.name}! 🎉`);
        setShowBuyNow(false);
    };

    return (
        <>
            <div className="product-item">
                <div className="product-image-container">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                    />
                    <div className="product-badge">
                        {product.type}
                    </div>
                </div>
                
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-price-section">
                        <div className="product-price">₹{product.price}</div>
                        <div className="price-label">
                            {product.price > 5000 ? '💎 Premium' : 
                             product.price > 1000 ? '⭐ Popular' : '💰 Budget'}
                        </div>
                    </div>

                    <div className="product-actions">
                        <button 
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                        >
                            🛒 Add to Cart
                        </button>
                        <button 
                            className="buy-now-btn"
                            onClick={handleBuyNow} // <-- updated
                        >
                            ⚡ Buy Now
                        </button>
                    </div>

                    <div className="product-features">
                        <span>✅ Free Shipping</span>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="success-message">
                    <div className="success-content">
                        ✅ {product.name} added to cart!
                    </div>
                </div>
            )}

            {/* Internal Quick Buy Modal */}
            {showBuyNow && (
                <div className="modal-overlay" onClick={() => setShowBuyNow(false)}>
                    <div className="buy-now-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>⚡ Quick Buy</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setShowBuyNow(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="quick-buy-content">
                            <div className="product-summary">
                                <img src={product.image} alt={product.name} />
                                <div>
                                    <h3>{product.name}</h3>
                                    <p className="price">₹{product.price}</p>
                                </div>
                            </div>

                            <form onSubmit={handleQuickBuy} className="quick-buy-form">
                                <h3>Delivery Details</h3>
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    required 
                                    defaultValue={user?.name}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    required 
                                />
                                <textarea 
                                    placeholder="Complete Address" 
                                    required
                                    rows="3"
                                ></textarea>
                                <input 
                                    type="text" 
                                    placeholder="PIN Code" 
                                    required 
                                />

                                <div className="payment-selection">
                                    <h4>Payment Method</h4>
                                    <label>
                                        <input type="radio" name="payment" value="cod" defaultChecked />
                                        💰 Cash on Delivery
                                    </label>
                                    <label>
                                        <input type="radio" name="payment" value="online" />
                                        💳 Pay Online (5% discount)
                                    </label>
                                </div>

                                <div className="order-total">
                                    <div className="total-row">
                                        <span>Product Price:</span>
                                        <span>₹{product.price}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Delivery:</span>
                                        <span>₹50</span>
                                    </div>
                                    <div className="total-row final">
                                        <span>Total:</span>
                                        <span>₹{(product.price + 50).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button type="submit" className="confirm-order-btn">
                                    🚀 Confirm Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductItem;
