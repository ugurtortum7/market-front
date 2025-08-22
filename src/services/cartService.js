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