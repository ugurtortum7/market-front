// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // YENİ EKLENEN STATE: Başlangıçta yükleniyor durumundayız.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decodedUser = jwtDecode(storedToken);
        // Token'ın son kullanma tarihini kontrol et (isteğe bağlı ama iyi bir pratik)
        if (decodedUser.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decodedUser);
        } else {
          // Token süresi dolmuşsa hafızadan sil
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error("Token okunurken bir hata oluştu:", error);
      localStorage.removeItem('token');
    } finally {
      // Hafızayı kontrol etme işlemi her durumda bittiğinde yükleniyor durumunu kapat.
      setIsLoading(false);
    }
  }, []);

  const login = (authData) => {
    // ... login fonksiyonu aynı kalıyor ...
    const { access_token } = authData;
    try {
        const decodedUser = jwtDecode(access_token);
        setToken(access_token);
        setUser(decodedUser);
        localStorage.setItem('token', access_token);
    } catch (error) {
        console.error("Gelen token çözümlenemedi:", error);
    }
  };

  const logout = () => {
    // ... logout fonksiyonu aynı kalıyor ...
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // isLoading'i de dışarıya sağlıyoruz.
  const value = { token, user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};