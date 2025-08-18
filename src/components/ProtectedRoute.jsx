// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material'; // Yükleme ikonu için

const ProtectedRoute = ({ children }) => {
  // isLoading durumunu da context'ten alıyoruz.
  const { token, isLoading } = useAuth();

  // EĞER YÜKLEME İŞLEMİ HALA DEVAM EDİYORSA...
  if (isLoading) {
    // Ekranda bir yükleme ikonu göster ve HİÇBİR ŞEY YAPMA.
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Yükleme bittikten sonra, eğer token yoksa...
  if (!token) {
    // Login'e yönlendir.
    return <Navigate to="/login" replace />;
  }

  // Yükleme bittiyse ve token varsa, sayfayı göster.
  return children;
};

export default ProtectedRoute;