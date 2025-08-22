// src/services/orderService.js
import apiClient from './apiClient';

export const createOrder = (addressData) => {
  return apiClient.post('/siparisler/', addressData);
};