// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as addToCartService, removeFromCart as removeFromCartService, clearCart as clearCartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const { token } = useAuth(); // Kullanıcının giriş yapıp yapmadığını anlamak için

  const fetchCart = useCallback(async () => {
    try {
      setLoadingCart(true);
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      console.error("Sepet bilgisi alınamadı:", error);
      setCart(null); // Hata durumunda sepeti sıfırla
    } finally {
      setLoadingCart(false);
    }
  }, []);

  // Kullanıcı giriş yaptığında (token geldiğinde) sepeti çek
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      // Kullanıcı çıkış yaparsa sepet bilgisini temizle
      setCart(null);
      setLoadingCart(false);
    }
  }, [token, fetchCart]);

  const updateCartState = (newCartData) => {
    setCart(newCartData);
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await addToCartService(productId, quantity);
      updateCartState(response.data); // Backend'den dönen güncel sepetle state'i güncelle
    } catch (error) {
      console.error("Sepete ürün eklenirken hata oluştu:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await removeFromCartService(productId);
      updateCartState(response.data);
    } catch (error) {
      console.error("Sepetten ürün silinirken hata oluştu:", error);
      throw error;
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await clearCartService();
      updateCartState(response.data);
    } catch (error) {
      console.error("Sepet temizlenirken hata oluştu:", error);
      throw error;
    }
  };
  
  // Sepetteki toplam ürün sayısı artık buradan hesaplanacak
  const cartItemCount = cart ? cart.urunler.reduce((total, item) => total + item.miktar, 0) : 0;

  const value = { cart, cartItemCount, loadingCart, addToCart, removeFromCart, clearCart, fetchCart };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};