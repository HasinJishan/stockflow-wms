import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item => item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (sku, delta) => {
    setCart(prev => prev.map(item => 
      item.sku === sku ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (sku) => setCart(prev => prev.filter(item => item.sku !== sku));

  // NEW: Function to empty the cart after successful order
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);