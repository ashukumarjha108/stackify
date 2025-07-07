// src/context/ItemContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [user, setUser] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Auth functions
    const signIn = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('user');
        setItems([]); // Clear cart on sign out
    };

    // Cart functions
    const addToCart = (product) => {
        const existingItem = items.find(item => item._id === product._id);
        
        if (existingItem) {
            setItems(items.map(item => 
                item._id === product._id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setItems([...items, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setItems(items.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setItems(items.map(item => 
                item._id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalItems = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const value = {
        items,
        setItems,
        user,
        signIn,
        signOut,
        showCart,
        setShowCart,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
    };

    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    );
};