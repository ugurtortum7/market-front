// src/services/uploadService.js

import apiClient from './apiClient';

/**
 * Bir resim dosyasını backend'e yükler.
 * @param {File} file - Yüklenecek resim dosyası.
 */
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post('/upload/image/', formData);
};