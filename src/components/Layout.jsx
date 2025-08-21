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
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>

              <Button color="inherit" onClick={() => navigate('/urunler')}>
                Ürünler
              </Button>

              {(user.rol === 'YONETICI' || user.rol === 'KASIYER') && (
                 <Button color="inherit" onClick={() => navigate('/stoklar')}>
                    Stoklar
                 </Button>
              )}
              
              {/* ===== GÜNCELLENEN KISIM BAŞLANGICI ===== */}
              {/* Yöneticiye özel butonlar burada gruplandı */}
              {user.rol === 'YONETICI' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/kategoriler')}>
                    Kategoriler
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/yeni-kullanici')}>
                    Kullanıcı Ekle
                  </Button>
                </>
              )}
              {/* ===== GÜNCELLENEN KISIM BİTİŞİ ===== */}

              <Typography component="span" sx={{ ml: 2, mr: 2 }}>
                Hoş geldin, {user.sub}!
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