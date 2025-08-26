// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/apiClient'; // apiClient'ı import ediyoruz

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decodedUser = jwtDecode(storedToken);
        if (decodedUser.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decodedUser);
          // Sayfa yenilendiğinde de apiClient'ın header'ını ayarla
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error("Token okunurken bir hata oluştu:", error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login fonksiyonunu API isteğini yapacak şekilde güncelledim.
  // Bu daha merkezi ve doğru bir yöntemdir.
  const login = async (username, password) => {
    // Fonksiyon bir Promise döndürecek (başarılı veya hatalı)
    return new Promise(async (resolve, reject) => {
      try {
        const response = await apiClient.post('/auth/login', { username, password });
        
        // ===== KONTROL NOKTASI: Backend'den gelen yanıtın tamamını görelim =====
        console.log("Backend'den gelen ham login yanıtı:", response);

        const { access_token } = response.data;

        if (!access_token || typeof access_token !== 'string') {
          // Eğer token yoksa veya string değilse hata fırlat
          throw new Error("Geçersiz token formatı alındı.");
        }

        const decodedUser = jwtDecode(access_token);
        setToken(access_token);
        setUser(decodedUser);
        localStorage.setItem('token', access_token);
        // Her başarılı girişte apiClient'ın header'ını ayarla
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        resolve(decodedUser); // Başarılı olursa kullanıcı bilgisiyle Promise'i çöz
      } catch (error) {
        console.error("Giriş işlemi sırasında hata:", error);
        reject(error); // Hatalı olursa hatayla birlikte Promise'i reddet
      }
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    // Çıkış yapıldığında apiClient header'ını temizle
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = { token, user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};