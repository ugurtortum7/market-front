// src/services/favoritesService.js

import apiClient from './apiClient';

/**
 * Mevcut kullanıcının favori ürünlerinin listesini getirir.
 */
export const getFavorites = () => {
  return apiClient.get('/favoriler/');
};

/**
 * Belirtilen ürünü kullanıcının favorilerine ekler.
 * @param {number} urunId - Favorilere eklenecek ürünün ID'si.
 */
export const addFavorite = (urunId) => {
  // POST /favoriler/urunler/{urun_id} endpoint'ine istek atar.
  // Bu endpoint'in body'de bir şey beklemediğini varsayıyoruz.
  return apiClient.post(`/favoriler/urunler/${urunId}`);
};

/**
 * Belirtilen ürünü kullanıcının favorilerinden kaldırır.
 * @param {number} urunId - Favorilerden kaldırılacak ürünün ID'si.
 */
export const removeFavorite = (urunId) => {
  return apiClient.delete(`/favoriler/urunler/${urunId}`);
};