// src/pages/CartPage.jsx
import React from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cart, loadingCart, removeFromCart, clearCart, updateCartItemQuantity } = useCart();

  if (loadingCart) { /* ... */ }
  if (!cart || cart.urunler.length === 0) { /* ... */ }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Sepetim</Typography>
        <Button variant="outlined" color="error" onClick={clearCart}>Sepeti Temizle</Button>
      </Box>
      <List>
        {cart.urunler.map((item) => (
          <React.Fragment key={item.urun.id}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Avatar variant="rounded" src={item.urun.resim_url || 'https://via.placeholder.com/100'} sx={{ width: 60, height: 60, mr: 2 }} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.urun.marka} - ${item.urun.urun_adi}`}
                secondary={`${item.urun.fiyat.toFixed(2)} TL / adet`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <IconButton size="small" onClick={() => updateCartItemQuantity(item.urun.id, item.miktar - 1)} disabled={item.miktar <= 1}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{item.miktar}</Typography>
                <IconButton size="small" onClick={() => updateCartItemQuantity(item.urun.id, item.miktar + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ minWidth: '100px', textAlign: 'right' }}>
                {(item.urun.fiyat * item.miktar).toFixed(2)} TL
              </Typography>
              <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.urun.id)} sx={{ ml: 1 }}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Toplam Tutar: {(cart.toplam_tutar || 0).toFixed(2)} TL
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>Siparişi Tamamla</Button>
      </Box>
    </Paper>
  );
}

export default CartPage;