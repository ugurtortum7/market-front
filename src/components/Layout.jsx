// src/components/Layout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
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
            Market E-Ticaret
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              
              <Button color="inherit" onClick={() => navigate('/urunler')}>Ürünler</Button>

              {(user.rol === 'YONETICI' || user.rol === 'KASIYER') && (
                 <Button color="inherit" onClick={() => navigate('/stoklar')}>Stoklar</Button>
              )}
              
              {user.rol === 'YONETICI' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/kategoriler')}>Kategorileri Yönet</Button>
                  <Button color="inherit" onClick={() => navigate('/yeni-kullanici')}>Kullanıcıları Yönet</Button>
                </>
              )}

              {/* ===== YENİ SİPARİŞLERİM LİNKİ EKLENDİ ===== */}
              <Button color="inherit" onClick={() => navigate('/siparislerim')}>
                Siparişlerim
              </Button>
              
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => navigate('/sepet')}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              
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