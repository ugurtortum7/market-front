// src/pages/CartPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Divider, Button, Paper, IconButton, TextField 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast'; // ===== GÜNCELLEME: Toast kütüphanesi import edildi =====

function CartPage() {
  const { 
    cart, loadingCart, cartError, removeFromCart, 
    clearCart, updateCartItemQuantity, onOrderSuccess 
  } = useCart();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');

  const handleCreateOrder = async () => {
    if (!address.trim()) {
      // ===== GÜNCELLEME: alert yerine toast.error kullanıldı =====
      toast.error('Lütfen teslimat adresi giriniz.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createOrder({ teslimat_adresi: address });
      // ===== GÜNCELLEME: alert yerine toast.success kullanıldı =====
      toast.success(`Siparişiniz başarıyla oluşturuldu!`);
      onOrderSuccess();
      navigate('/siparislerim'); // Sipariş sonrası siparişlerim sayfasına yönlendirme daha mantıklı
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Sipariş oluşturulamadı.';
      // ===== GÜNCELLEME: alert yerine toast.error kullanıldı =====
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCart) {
    // Gelecekte buraya da bir iskelet yükleme ekranı yapabiliriz.
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cartError) {
    return <Alert severity="error" sx={{ m: 3 }}>{cartError}</Alert>;
  }

  if (!cart || cart.urunler.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Sepetiniz boş.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/urunler')}>
          Alışverişe Başla
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, margin: 'auto', backgroundColor: 'background.paper', borderRadius: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>Sepetim</Typography>
          <Button variant="outlined" color="error" onClick={clearCart}>Sepeti Temizle</Button>
      </Box>
      <List>
        {cart.urunler.map((item) => (
          <React.Fragment key={item.urun.id}>
            <ListItem 
              alignItems="center"
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.urun.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar variant="rounded" src={item.urun.resim_url || 'https://via.placeholder.com/100'} sx={{ width: 60, height: 60, mr: 2, borderRadius: '8px' }} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.urun.marka} - ${item.urun.urun_adi}`}
                secondary={`${(item.urun.fiyat || 0).toFixed(2)} TL / adet`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, whiteSpace: 'nowrap' }}>
                <IconButton size="small" onClick={() => updateCartItemQuantity(item.urun.id, item.miktar - 1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2, fontWeight: 500 }}>{item.miktar}</Typography>
                <IconButton size="small" onClick={() => updateCartItemQuantity(item.urun.id, item.miktar + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ minWidth: '100px', textAlign: 'right', fontWeight: 'bold' }}>
                {((item.urun.fiyat || 0) * item.miktar).toFixed(2)} TL
              </Typography>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Teslimat Bilgileri</Typography>
        <TextField
          label="Teslimat Adresi"
          fullWidth
          multiline
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
        />
      </Box>
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Toplam Tutar: {(parseFloat(cart.toplam_tutar) || 0).toFixed(2)} TL
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ mt: 2, py: 1.5, px: 4 }} 
          onClick={handleCreateOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Siparişi Tamamla'}
        </Button>
      </Box>
    </Paper>
  );
}

export default CartPage;