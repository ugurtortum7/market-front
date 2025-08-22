// src/services/orderService.js
import apiClient from './apiClient';

export const createOrder = (addressData) => {
  return apiClient.post('/siparisler/', addressData);
};

/**
 * Giriş yapmış kullanıcının geçmiş siparişlerini getirir.
 */
export const getOrders = () => {
  return apiClient.get('/siparisler/');
};