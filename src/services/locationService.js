import apiClient from './apiClient';

/**
 * Sistemdeki tüm lokasyonların listesini getirir.
 */
export const getLocations = () => {
  return apiClient.get('/lokasyonlar/');
};