// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Token'ı çözümlemek için bir kütüphane

// 1. Context'i oluşturuyoruz
const AuthContext = createContext(null);

// 2. Diğer bileşenlerin bu context'e erişmesini sağlayacak Provider'ı oluşturuyoruz
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Bu useEffect, uygulama ilk yüklendiğinde çalışır
  useEffect(() => {
    // Tarayıcının hafızasındaki (localStorage) token'ı kontrol et
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setToken(storedToken);
        setUser(decodedUser);
      } catch (error) {
        console.error("Geçersiz token:", error);
        // Token geçersizse hafızadan sil
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login olduğunda çağrılacak fonksiyon
  const login = (authData) => {
    const { access_token } = authData;
    try {
        const decodedUser = jwtDecode(access_token);
        setToken(access_token);
        setUser(decodedUser);
        // Token'ı tarayıcının hafızasına kaydediyoruz ki sayfa yenilense de gitmesin
        localStorage.setItem('token', access_token);
    } catch (error) {
        console.error("Gelen token çözümlenemedi:", error);
    }
  };

  // Logout olduğunda çağrılacak fonksiyon
  const logout = () => {
    setToken(null);
    setUser(null);
    // Token'ı tarayıcının hafızasından siliyoruz
    localStorage.removeItem('token');
  };

  // Bu değerleri ve fonksiyonları tüm uygulamaya sağlıyoruz
  const value = { token, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Context'i daha kolay kullanmak için bir custom hook oluşturuyoruz
export const useAuth = () => {
  return useContext(AuthContext);
};