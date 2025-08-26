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
  // ===== DOĞRU URL =====
  // Adresteki fazladan "/urunler" kısmı kaldırıldı.
  return apiClient.post(`/favoriler/${urunId}`);
};

/**
 * Belirtilen ürünü kullanıcının favorilerinden kaldırır.
 * @param {number} urunId - Favorilerden kaldırılacak ürünün ID'si.
 */
export const removeFavorite = (urunId) => {
  // ===== DOĞRU URL =====
  // Adresteki fazladan "/urunler" kısmı kaldırıldı.
  return apiClient.delete(`/favoriler/${urunId}`);
};