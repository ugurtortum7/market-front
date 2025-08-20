import apiClient from './apiClient';

/**
 * Sistemdeki tüm stok kayıtlarının listesini getirir.
 */
export const getStocks = () => {
  return apiClient.get('/stoklar/');
};

/**
 * Yeni bir stok kaydı oluşturmak için API'ye POST isteği gönderir.
 * @param {object} stockData - Yeni stok kaydının bilgilerini içeren obje.
 * Örn: { miktar, urun_id, lokasyon_id }
 */
export const createStock = (stockData) => {
  return apiClient.post('/stoklar/', stockData);
};