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

/**
 * Yeni bir ürün oluşturmak için API'ye POST isteği gönderir.
 * @param {object} productData - Yeni ürünün bilgilerini içeren obje.
 * Örn: { urun_adi, aciklama, sku } // Fiyat'ı sku ile güncelledik
 */
export const createProduct = (productData) => {
  return apiClient.post('/urunler/', productData);
};