// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bu bileşen, bir "children" prop'u alır. Bu, korumak istediğimiz sayfanın kendisidir.
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); // Global state'imizden token bilgisini alıyoruz.

  // Eğer token yoksa (yani kullanıcı giriş yapmamışsa)...
  if (!token) {
    // Kullanıcıyı login sayfasına yönlendir.
    // "replace" prop'u, tarayıcı geçmişinde geri tuşuna basıldığında
    // tekrar korumalı sayfaya dönmesini engeller.
    return <Navigate to="/login" replace />;
  }

  // Eğer token varsa, korumak istediğimiz sayfayı (children) göster.
  return children;
};

export default ProtectedRoute;