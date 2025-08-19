// src/services/productService.js

import apiClient from './apiClient';

/**
 * Sistemdeki tüm ürünlerin listesini getirir.
 */
export const getProducts = () => {
  return apiClient.get('/urunler/');
};

/**
 * Yeni bir ürün oluşturmak için API'ye POST isteği gönderir.
 * @param {object} productData - Yeni ürünün bilgilerini içeren obje.
 * Örn: { urun_adi, aciklama, fiyat }
 */
export const createProduct = (productData) => {
  return apiClient.post('/urunler/', productData);
};