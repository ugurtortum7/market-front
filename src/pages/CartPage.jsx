// src/pages/CartPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
// ===== DEĞİŞİKLİK BURADA: 'Paper' import'a eklendi =====
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const { cart, loadingCart, removeFromCart, clearCart, updateCartItemQuantity, onOrderSuccess } = useCart();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');

  const handleCreateOrder = async () => {
    if (!address.trim()) {
      alert('Lütfen teslimat adresi giriniz.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createOrder({ teslimat_adresi: address });
      alert(`Siparişiniz başarıyla oluşturuldu! Sipariş ID: ${response.data.id}`);
      onOrderSuccess();
      navigate('/');
    } catch (err) {
      alert(`Hata: ${err.response?.data?.detail || 'Sipariş oluşturulamadı.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCart) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  // Hata mesajını burada göstermek daha iyi olabilir
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!cart || cart.urunler.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Sepetiniz boş.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
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
                <Avatar variant="rounded" src={item.urun.resim_url || 'https://via.placeholder.com/100'} sx={{ width: 60, height: 60, mr: 2 }} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.urun.marka} - ${item.urun.urun_adi}`}
                secondary={`Miktar: ${item.miktar} x ${(item.urun.fiyat || 0).toFixed(2)} TL`}
              />
              <Typography variant="h6" sx={{ minWidth: '100px', textAlign: 'right' }}>
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
          Toplam Tutar: {(cart.toplam_tutar || 0).toFixed(2)} TL
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ mt: 2 }} 
          onClick={handleCreateOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Siparişi Tamamla'}
        </Button>
      </Box>
    </Paper>
  );
}

// Bu satırı eklemeyi unutmayın, önceki kodda eksik kalmış olabilir
export default CartPage;