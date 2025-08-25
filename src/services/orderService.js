// src/services/orderService.js

import apiClient from './apiClient';

/**
 * Yeni bir sipariş oluşturur.
 * @param {object} addressData - Teslimat adresini içeren obje.
 */
export const createOrder = (addressData) => {
  return apiClient.post('/siparisler/', addressData);
};

/**
 * Giriş yapmış kullanıcının geçmiş siparişlerini getirir.
 */
export const getOrders = () => {
  return apiClient.get('/siparisler/');
};

/**
 * Belirtilen sipariş ID'sine ait faturayı (PDF) indirir.
 * @param {number} orderId - Faturası indirilecek siparişin ID'si.
 */
export const downloadInvoice = (orderId) => {
  return apiClient.get(`/siparisler/${orderId}/fatura`, {
    // Cevabın bir dosya (blob) olarak algılanmasını söylüyoruz
    responseType: 'blob', 
  });
};