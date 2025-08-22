// src/services/cartService.js

import apiClient from './apiClient';

/**
 * Kullanıcının sepetine belirtilen üründen belirtilen miktarda ekler.
 * @param {number} productId - Eklenecek ürünün ID'si.
 * @param {number} quantity - Eklenecek miktar.
 */
export const addToCart = (productId, quantity) => {
  return apiClient.post('/sepet/urunler', {
    urun_id: productId,
    miktar: quantity,
  });
};

/**
 * Giriş yapmış olan kullanıcının sepet bilgilerini getirir.
 */
export const getCart = () => {
  return apiClient.get('/sepet/');
};

export const removeFromCart = (productId) => {
  return apiClient.delete(`/sepet/urunler/${productId}`);
};

export const clearCart = () => {
  return apiClient.delete('/sepet/');
};

export const updateCartItemQuantity = (productId, newQuantity) => {
  return apiClient.put(`/sepet/urunler`, { urun_id: productId, yeni_miktar: newQuantity });
};