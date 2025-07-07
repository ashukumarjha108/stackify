import React, { useState, useEffect, useContext } from 'react';
import ProductItem from './ProductItem';
import { ItemContext } from '../context/ItemContext';
import BuyNowModal from './BuyNowModal'; // ✅ modal import

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [selectedProduct, setSelectedProduct] = useState(null); // ✅ new state

    const {
        searchQuery,
        priceRange,
        selectedCategory
    } = useContext(ItemContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, priceRange, selectedCategory, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5000/api/products');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success && data.data) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please make sure the server is running on http://localhost:5000');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.type.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (priceRange.min || priceRange.max) {
            filtered = filtered.filter(product => {
                const price = product.price;
                const min = priceRange.min ? parseFloat(priceRange.min) : 0;
                const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }

        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleBuyNow = (product) => {
        setSelectedProduct(product);
    };

    const handlePayment = () => {
        alert(`Payment successful for ${selectedProduct.name}`);
        setSelectedProduct(null);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading amazing products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-list">
            <div className="container">
                <div className="products-header">
                    <div className="results-info">
                        <h2>🌟 Featured Products</h2>
                        <p>
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                            {searchQuery && <span> for "{searchQuery}"</span>}
                            {selectedCategory !== 'all' && <span> in {selectedCategory}</span>}
                        </p>
                    </div>

                    <div className="sort-controls">
                        <label htmlFor="sort">Sort by:</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name A-Z</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="no-products">
                        <div className="no-products-icon">🔍</div>
                        <h3>No products found</h3>
                        <p>
                            {searchQuery || selectedCategory !== 'all' || priceRange.min || priceRange.max
                                ? 'Try adjusting your search or filters'
                                : 'Check back later for amazing deals!'
                            }
                        </p>
                        {(searchQuery || selectedCategory !== 'all' || priceRange.min || priceRange.max) && (
                            <button
                                onClick={() => window.location.reload()}
                                className="clear-filters-btn"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <ProductItem
                                key={product._id}
                                product={product}
                                onBuyNow={() => handleBuyNow(product)} // ✅ pass to child
                            />
                        ))}
                    </div>
                )}

                {filteredProducts.length > 0 && (
                    <div className="products-stats">
                        <div className="stat-item">
                            <span className="stat-number">{filteredProducts.length}</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                ₹{Math.min(...filteredProducts.map(p => p.price))}
                            </span>
                            <span className="stat-label">Starting Price</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {new Set(filteredProducts.map(p => p.type)).size}
                            </span>
                            <span className="stat-label">Categories</span>
                        </div>
                    </div>
                )}

                {/* ✅ Buy Now Modal */}
                <BuyNowModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onPay={handlePayment}
                />
            </div>
        </div>
    );
};

export default ProductList;
