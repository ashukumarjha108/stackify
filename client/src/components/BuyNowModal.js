import React from 'react';
// import './BuyNowModal.css'; // optional, for styles

const BuyNowModal = ({ product, onClose, onPay }) => {
    if (!product) return null;

    return (
        <div className="modal-overlay">
            <div className="buy-now-modal">
                <div className="modal-header">
                    <h3>Confirm Purchase</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <p><strong>Product:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <button className="place-order-btn" onClick={onPay}>
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyNowModal;
