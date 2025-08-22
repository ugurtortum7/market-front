// src/context/CartContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { addToCart as addToCartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Bu fonksiyon, bir ürünü sepete ekler ve başarılı olursa sayacı günceller.
  const addToCart = async (productId, quantity) => {
    try {
      const response = await addToCartService(productId, quantity);
      // Backend'den dönen güncel sepet bilgisindeki ürünlerin toplam miktarını hesapla
      const newTotalQuantity = response.data.urunler.reduce((total, item) => total + item.miktar, 0);
      setCartItemCount(newTotalQuantity);
    } catch (error) {
      console.error("Sepete ürün eklenirken hata oluştu:", error);
      // Hatanın bileşen tarafından da yakalanabilmesi için tekrar fırlat
      throw error;
    }
  };

  const value = { cartItemCount, addToCart };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};