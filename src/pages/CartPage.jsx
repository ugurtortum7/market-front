// src/pages/CartPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ... diğer importlar ...
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService'; // Sipariş servisi

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
      onOrderSuccess(); // Sepet context'ini temizle
      navigate('/'); // Kullanıcıyı ana sayfaya yönlendir
    } catch (err) {
      alert(`Hata: ${err.response?.data?.detail || 'Sipariş oluşturulamadı.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCart) { /* ... */ }
  if (!cart || cart.urunler.length === 0) { /* ... */ }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      {/* ... Sepetim başlığı ve listesi aynı kalıyor ... */}

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
export default CartPage;