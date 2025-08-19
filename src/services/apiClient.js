// src/services/apiClient.js

import axios from 'axios';

// 1. Axios istemcisini oluşturuyoruz.
// Temel URL olarak, Vercel'e eklediğimiz ortam değişkenini kullanıyor.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 2. Axios "Request Interceptor" (İstek Yakalayıcı) Tanımlıyoruz.
// Bu kod, projemizden çıkan HER API isteğini yakalar ve gönderilmeden hemen önce araya girer.
apiClient.interceptors.request.use(
  (config) => {
    // Tarayıcının hafızasından (localStorage) token'ı alıyoruz.
    const token = localStorage.getItem('token');

    // Eğer token varsa...
    if (token) {
      // İsteğin başlıklarına (headers) Authorization bölümünü ekliyoruz.
      // FastAPI'nin beklediği format "Bearer [token]" şeklindedir.
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Değişiklikleri yaptıktan sonra isteğin yoluna devam etmesine izin veriyoruz.
    return config;
  },
  (error) => {
    // Bir hata olursa, hatayı daha sonra yakalayabilmek için geri döndürüyoruz.
    return Promise.reject(error);
  }
);

console.log("API İstemcisi şu adresi kullanıyor:", apiClient.defaults.baseURL);


export default apiClient;

