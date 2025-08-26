// src/components/Layout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// ===== ANİMASYON İÇİN EKLENDİ (1/2) =====
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Footer from './Footer';

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
        {/* ... AppBar içeriği aynı kalıyor ... */}
        <Toolbar sx={{ py: 1 }}>
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
                  <Button color="inherit" onClick={() => navigate('/kategoriler')}>Kategoriler</Button>
                  <Button color="inherit" onClick={() => navigate('/yeni-kullanici')}>Kullanıcılar</Button>
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
              <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ borderRadius: '20px', textTransform: 'none' }}>
                Çıkış Yap
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== ANİMASYON İÇİN EKLENDİ (2/2) ===== */}
        {/* AnimatePresence, bileşenler ekrandan ayrılırken animasyon oynatılmasını sağlar. */}
        {/* motion.div, animasyon özelliklerini alan ana kapsayıcıdır. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname} // Her sayfa değişiminde animasyonun tetiklenmesi için
            initial={{ opacity: 0, y: 20 }} // Başlangıç durumu: görünmez ve hafif aşağıda
            animate={{ opacity: 1, y: 0 }} // Bitiş durumu: görünür ve normal pozisyonunda
            exit={{ opacity: 0, y: -20 }} // Çıkış durumu: görünmez ve hafif yukarıda
            transition={{ duration: 0.3 }} // Animasyon süresi
          >
            <Outlet /> 
          </motion.div>
        </AnimatePresence>
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;