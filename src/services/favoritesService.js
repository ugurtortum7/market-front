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
 * @param {object} data - İstek body'sinde gönderilecek veri. Örn: { bildirim_istiyor_mu: false }
 */
export const addFavorite = (urunId, data) => {
  // ===== DÜZELTME BURADA YAPILDI =====
  // apiClient.post'un ikinci parametresi olarak 'data' objesini gönderiyoruz.
  return apiClient.post(`/favoriler/${urunId}`, data);
};

/**
 * Belirtilen ürünü kullanıcının favorilerinden kaldırır.
 * @param {number} urunId - Favorilerden kaldırılacak ürünün ID'si.
 */
export const removeFavorite = (urunId) => {
  // Silme işleminde genellikle body gerekmez, bu yüzden bu fonksiyon aynı kalıyor.
  return apiClient.delete(`/favoriler/${urunId}`);
};