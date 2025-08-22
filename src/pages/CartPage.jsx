// src/pages/CartPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button, Paper } from '@mui/material';
import { getCart } from '../services/cartService';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.data);
      setError('');
    } catch (err) {
      setError('Sepet yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!cart || cart.urunler.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Sepetiniz boş.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Sepetim
      </Typography>
      <List>
        {cart.urunler.map((item) => (
          <React.Fragment key={item.urun.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar variant="rounded" src={item.urun.resim_url || 'https://via.placeholder.com/100'} sx={{ width: 60, height: 60, mr: 2 }} />
              </ListItemAvatar>
              <ListItemText
                primary={item.urun.urun_adi}
                secondary={`Miktar: ${item.miktar}`}
              />
              <Typography variant="h6">
                {(item.urun.fiyat * item.miktar).toFixed(2)} TL
              </Typography>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Toplam Tutar: {cart.toplam_tutar.toFixed(2)} TL
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>
          Siparişi Tamamla
        </Button>
      </Box>
    </Paper>
  );
}

export default CartPage;