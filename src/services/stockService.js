import apiClient from './apiClient';

/**
 * Sistemdeki tüm stok kayıtlarının listesini getirir.
 */
export const getStocks = () => {
  return apiClient.get('/stoklar/');
};