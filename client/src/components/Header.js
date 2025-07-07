// // client/src/components/Header.js
// import React, { useContext } from 'react';
// import { FontAwesomeIcon }
//     from '@fortawesome/react-fontawesome'
// import { faCartShopping }
//     from '@fortawesome/free-solid-svg-icons'
// import { ItemContext } from '../context/ItemContext';

// const Navbar = () => {

//     const { itemsInCart, totalPrice } = useContext(ItemContext);

//     return (
//         <nav className='navbar'>
//             <div className='navbar-brand'>
//                 <h1 className='ecom'>
//                     My Ecommerce Website
//                 </h1>
//             </div>
//             <div className='navbar-items'>
//                 <h3 style={{ color: "green" }}>
//                     Total Price: {totalPrice}
//                 </h3>
//                 <div className='cart-num'>
//                     <FontAwesomeIcon
//                         icon={faCartShopping} size="2x" />
//                     <div className='cart-items'>
//                         {itemsInCart}
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;








// src/components/Header.js
// src/components/Header.js
import React, { useContext, useState } from 'react';
import { ItemContext } from '../context/ItemContext';

const Header = () => {
    const { 
        user, 
        signIn, 
        signOut, 
        getTotalItems, 
        getTotalPrice, 
        setShowCart,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        selectedCategory,
        setSelectedCategory
    } = useContext(ItemContext);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
    const [showFilters, setShowFilters] = useState(false);

    const handleAuth = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name') || 'Guest User',
            email: formData.get('email'),
            id: Date.now().toString()
        };
        signIn(userData);
        setShowAuthModal(false);
    };

    const categories = ['all', 'Men', 'Women', 'Kids', 'Books', 'Unisex', 'Collectibles'];

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            🛒 ShopEase
                        </div>

                        {/* Search Bar */}
                        <div className="search-section">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <button 
                                    className="filter-toggle"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    🔍 Filters
                                </button>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="filters-panel">
                                    <div className="filter-group">
                                        <label>Category:</label>
                                        <select 
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat === 'all' ? 'All Categories' : cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="filter-group">
                                        <label>Price Range:</label>
                                        <div className="price-inputs">
                                            <input
                                                type="number"
                                                placeholder="Min ₹"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                            />
                                            <span>to</span>
                                            <input
                                                type="number"
                                                placeholder="Max ₹"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="quick-filters">
                                        <button onClick={() => setPriceRange({min: '', max: '1000'})}>
                                            Under ₹1000
                                        </button>
                                        <button onClick={() => setPriceRange({min: '1000', max: '5000'})}>
                                            ₹1000 - ₹5000
                                        </button>
                                        <button onClick={() => setPriceRange({min: '5000', max: ''})}>
                                            Above ₹5000
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right side - Auth & Cart */}
                        <div className="header-actions">
                            {user ? (
                                <div className="user-menu">
                                    <span>Hello, {user.name}!</span>
                                    <button onClick={signOut} className="auth-btn">
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setShowAuthModal(true)}
                                    className="auth-btn"
                                >
                                    Sign In
                                </button>
                            )}

                            <div className="cart-section">
                                <button 
                                    className="cart-btn"
                                    onClick={() => setShowCart(true)}
                                >
                                    🛒 Cart ({getTotalItems()})
                                </button>
                                <div className="cart-total">
                                    ₹{getTotalPrice().toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setShowAuthModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAuth} className="auth-form">
                            {authMode === 'signup' && (
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    required
                                />
                            )}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                            
                            <button type="submit" className="submit-btn">
                                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="auth-toggle">
                            {authMode === 'signin' ? (
                                <p>
                                    Don't have an account? 
                                    <button 
                                        type="button"
                                        onClick={() => setAuthMode('signup')}
                                        className="link-btn"
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account? 
                                    <button 
                                        type="button"
                                        onClick={() => setAuthMode('signin')}
                                        className="link-btn"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;