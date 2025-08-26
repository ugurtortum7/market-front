// src/components/Layout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
// ===== TASARIM GÜNCELLEMESİ: İkon Outlined versiyonu ile değiştirildi =====
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ py: 1 }}> {/* Dikey padding eklendi */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Market
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              
              <Button color="inherit" onClick={() => navigate('/urunler')}>Ürünler</Button>
              <Button color="inherit" onClick={() => navigate('/favorilerim')}>Favorilerim</Button>
              <Button color="inherit" onClick={() => navigate('/siparislerim')}>Siparişlerim</Button>

              {user.rol === 'YONETICI' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/stoklar')}>Stoklar</Button>
                  <Button color="inherit" onClick={() => navigate('/kategoriler')}>Kategorileri Yönet</Button>
                  <Button color="inherit" onClick={() => navigate('/yeni-kullanici')}>Kullanıcıları Yönet</Button>
                </>
              )}
              
              <IconButton color="inherit" sx={{ ml: 1, mr: 1 }} onClick={() => navigate('/sepet')}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
              
              <Typography component="span" sx={{ ml: 2, mr: 1.5 }}>
                {user.sub}
              </Typography>
              {/* ===== TASARIM GÜNCELLEMESİ: Çıkış butonu daha zarif hale getirildi ===== */}
              <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ borderRadius: '20px', textTransform: 'none' }}>
                Çıkış Yap
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* ===== TASARIM GÜNCELLEMESİ: Sayfa içi boşluk artırıldı ===== */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 5 } }}>
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;