// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '@mui/material';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Eğer kullanıcı YÖNETİCİ değilse, ana sayfaya yönlendir.
  if (user && user.rol !== 'YONETICI') {
    // İsteğe bağlı olarak bir uyarı mesajı da gösterebilirsiniz.
    // Bu örnekte direkt yönlendirme yapıyoruz.
    return <Navigate to="/" replace />;
  }

  // Eğer kullanıcı YÖNETİCİ ise, istenen sayfayı göster.
  return children;
};

export default AdminRoute;