// src/services/productService.js

import apiClient from './apiClient';

/**
 * Sistemdeki tüm ürünlerin listesini getirir.
 */
export const getProducts = () => {
  // apiClient.get, token'ı otomatik olarak ekleyerek GET isteği atar.
  // Dönen veri, response'un 'data' özelliğinde bulunur.
  return apiClient.get('/urunler/');
};