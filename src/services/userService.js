// src/services/userService.js

import apiClient from './apiClient'; // Daha önce oluşturduğumuz Axios istemcisi

/**
 * Yeni bir kullanıcı oluşturmak için API'ye POST isteği gönderir.
 * @param {object} userData - Yeni kullanıcının bilgilerini içeren obje.
 * Örn: { kullanici_adi, rol, lokasyon_id, password }
 */
export const createUser = (userData) => {
  return apiClient.post('/kullanicilar/', userData);
};