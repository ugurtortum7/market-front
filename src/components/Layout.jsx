// src/components/Layout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Context'teki logout fonksiyonunu çağırır (state'i ve localStorage'ı temizler)
    navigate('/login'); // Kullanıcıyı login sayfasına yönlendirir
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Market Yönetim Sistemi
          </Typography>
          {user && ( // Sadece kullanıcı giriş yapmışsa bu bölümü göster
            <Box sx={{ display: 'flex', alignItems: 'center' }}>

              {/* ===== YENİ EKLENEN KISIM BAŞLANGICI ===== */}
              {/* Eğer giriş yapan kullanıcının rolü 'YONETICI' ise bu butonu göster */}
              {user.rol === 'YONETICI' && (
                <Button color="inherit" onClick={() => navigate('/yeni-kullanici')}>
                  Kullanıcı Ekle
                </Button>
              )}
              {/* ===== YENİ EKLENEN KISIM BİTİŞİ ===== */}
              <Button color="inherit" onClick={() => navigate('/urunler')}>
                Ürünler
              </Button>              

              <Typography component="span" sx={{ ml: 2, mr: 2 }}> {/* Butonla arasında boşluk olması için ml: 2 eklendi */}
                Hoş geldin, {user.sub}! {/* 'sub' token'dan gelen kullanıcı adıdır */}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Bu kısım, App.jsx'teki aktif rotanın (HomePage vb.) render edileceği yerdir */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;