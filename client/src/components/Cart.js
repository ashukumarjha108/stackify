// src/components/Cart.js
import React, { useContext, useState } from 'react';
import { ItemContext } from '../context/ItemContext';

const Cart = () => {
    const { 
        items, 
        showCart, 
        setShowCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getTotalPrice,
        user
    } = useContext(ItemContext);

    const [showCheckout, setShowCheckout] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleCheckout = () => {
        if (!user) {
            alert('Please sign in to complete your purchase');
            return;
        }
        setShowCheckout(true);
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Simulate order placement
        setOrderPlaced(true);
        setTimeout(() => {
            clearCart();
            setShowCart(false);
            setShowCheckout(false);
            setOrderPlaced(false);
            alert('Order placed successfully! 🎉');
        }, 2000);
    };

    if (!showCart) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>🛒 Shopping Cart</h2>
                    <button 
                        className="close-btn"
                        onClick={() => setShowCart(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="cart-content">
                    {items.length === 0 ? (
                        <div className="empty-cart">
                            <h3>Your cart is empty</h3>
                            <p>Add some amazing products to get started!</p>
                            <button 
                                className="continue-shopping"
                                onClick={() => setShowCart(false)}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {items.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <h4>{item.name}</h4>
                                            <p className="cart-item-type">{item.type}</p>
                                            <p className="cart-item-price">₹{item.price}</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <div className="quantity-controls">
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="qty-btn"
                                                >
                                                    -
                                                </button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="qty-btn"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="item-total">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item._id)}
                                                className="remove-btn"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="cart-total">
                                    <h3>Total: ₹{getTotalPrice().toFixed(2)}</h3>
                                </div>
                                
                                <div className="cart-actions">
                                    <button 
                                        onClick={clearCart}
                                        className="clear-cart-btn"
                                    >
                                        Clear Cart
                                    </button>
                                    <button 
                                        onClick={handleCheckout}
                                        className="checkout-btn"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Checkout Modal */}
                {showCheckout && (
                    <div className="checkout-overlay">
                        <div className="checkout-modal">
                            {orderPlaced ? (
                                <div className="order-success">
                                    <div className="success-animation">
                                        <div className="checkmark">✅</div>
                                    </div>
                                    <h2>Order Placed Successfully!</h2>
                                    <p>Thank you for your purchase. Your order is being processed.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="checkout-header">
                                        <h2>🚀 Checkout</h2>
                                        <button 
                                            onClick={() => setShowCheckout(false)}
                                            className="close-btn"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={handlePlaceOrder} className="checkout-form">
                                        <div className="checkout-section">
                                            <h3>Shipping Information</h3>
                                            <input 
                                                type="text" 
                                                placeholder="Full Name" 
                                                required 
                                                defaultValue={user?.name}
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Address Line 1" 
                                                required 
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Address Line 2" 
                                            />
                                            <div className="form-row">
                                                <input 
                                                    type="text" 
                                                    placeholder="City" 
                                                    required 
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="PIN Code" 
                                                    required 
                                                />
                                            </div>
                                            <input 
                                                type="tel" 
                                                placeholder="Phone Number" 
                                                required 
                                            />
                                        </div>

                                        <div className="checkout-section">
                                            <h3>Payment Method</h3>
                                            <div className="payment-options">
                                                <label>
                                                    <input type="radio" name="payment" value="card" defaultChecked />
                                                    💳 Credit/Debit Card
                                                </label>
                                                <label>
                                                    <input type="radio" name="payment" value="upi" />
                                                    📱 UPI Payment
                                                </label>
                                                <label>
                                                    <input type="radio" name="payment" value="cod" />
                                                    💰 Cash on Delivery
                                                </label>
                                            </div>
                                        </div>

                                        <div className="order-summary">
                                            <h3>Order Summary</h3>
                                            <div className="summary-row">
                                                <span>Subtotal:</span>
                                                <span>₹{getTotalPrice().toFixed(2)}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Shipping:</span>
                                                <span>₹50</span>
                                            </div>
                                            <div className="summary-row total">
                                                <span>Total:</span>
                                                <span>₹{(getTotalPrice() + 50).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button type="submit" className="place-order-btn">
                                            🛒 Place Order
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;