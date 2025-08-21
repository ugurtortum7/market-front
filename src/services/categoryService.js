// src/services/categoryService.js

import apiClient from './apiClient';

/**
 * Sistemdeki tüm kategorilerin listesini getirir.
 */
export const getCategories = () => {
  return apiClient.get('/kategoriler/');
};

/**
 * Yeni bir kategori oluşturmak için API'ye POST isteği gönderir.
 * @param {object} categoryData - Yeni kategorinin adını içeren obje. Örn: { ad: "Meyve" }
 */
export const createCategory = (categoryData) => {
  return apiClient.post('/kategoriler/', categoryData);
};