// src/pages/CartPage.jsx

import React from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext'; // Kendi context'imizi kullanıyoruz

function CartPage() {
  // Veriyi artık local state yerine global context'ten alıyoruz
  const { cart, loadingCart, removeFromCart, clearCart } = useCart();

  if (loadingCart) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!cart || cart.urunler.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Sepetiniz boş.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Sepetim</Typography>
        <Button variant="outlined" color="error" onClick={clearCart}>Sepeti Temizle</Button>
      </Box>
      <List>
        {cart.urunler.map((item) => (
          <React.Fragment key={item.urun.id}>
            <ListItem 
              alignItems="flex-start"
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
                secondary={`Miktar: ${item.miktar} x ${item.urun.fiyat.toFixed(2)} TL`}
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