// src/components/Layout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              {/* === MÜŞTERİ & PERSONEL LİNKLERİ === */}
              <Button color="inherit" onClick={() => navigate('/urunler')}>Ürünler</Button>
              
              {(user.rol === 'YONETICI' || user.rol === 'KASIYER') && (
                 <Button color="inherit" onClick={() => navigate('/stoklar')}>Stoklar</Button>
              )}
              
              {/* === SADECE YÖNETİCİ LİNKLERİ === */}
              {user.rol === 'YONETICI' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/admin/urunler')}>Ürün Yönetimi</Button>
                  <Button color="inherit" onClick={() => navigate('/kategoriler')}>Kategori Yönetimi</Button>
                  <Button color="inherit" onClick={() => navigate('/yeni-kullanici')}>Kullanıcı Ekle</Button>
                </>
              )}
              
              {/* === KULLANICI BİLGİLERİ VE ÇIKIŞ === */}
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
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;