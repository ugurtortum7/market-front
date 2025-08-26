// src/components/ProductCard.jsx

import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, CircularProgress, IconButton } from '@mui/material';
// ===== TASARIM GÜNCELLEMESİ: İkon Outlined versiyonu ile değiştirildi =====
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast'; // Toast bildirimleri için import edildi

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const imageUrl = product.resim_url || 'https://via.placeholder.com/300x200.png?text=Urun+Resmi';
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.urun_adi} sepete eklendi!`); // alert yerine toast.success
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Ürün sepete eklenemedi.";
      toast.error(errorMessage); // alert yerine toast.error
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (typeof onToggleFavorite !== 'function') {
      console.error("HATA: onToggleFavorite prop'u bir fonksiyon olarak gönderilmedi!");
      return;
    }
    setIsTogglingFavorite(true);
    try {
      await onToggleFavorite(product.id, isFavorite);
      // Başarı bildirimini onToggleFavorite fonksiyonu içinde (ProductsPage'de) yapmak daha doğru olur.
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu.");
      console.error("'onToggleFavorite' çalıştırılırken hata oluştu:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', position: 'relative' }}>
      <IconButton
        aria-label="favorilere ekle"
        onClick={handleFavoriteClick}
        disabled={isTogglingFavorite}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }
        }}
      >
        {isTogglingFavorite ? <CircularProgress size={24} /> : isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderOutlinedIcon />}
      </IconButton>
      
      <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <CardMedia component="img" image={imageUrl} alt={product.urun_adi} sx={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
      </Box>
      
      <CardContent sx={{ pt: 1, pb: 1, px: 3 }}>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
          {product.marka}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" sx={{ lineHeight: 1.3, height: '2.6em', mb: 1 }}> {/* Yükseklik ayarlandı */}
          {product.urun_adi}
        </Typography>
      </CardContent>
      
      <Box sx={{ flexGrow: 1 }} />

      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, pb: 3 }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 2 }}>
          {(parseFloat(product.fiyat) || 0).toFixed(2)} TL
        </Typography>
        <Button fullWidth size="large" variant="contained" color="primary" onClick={handleAddToCart} disabled={isAdding} sx={{ py: 1.2 }}>
          {isAdding ? <CircularProgress size={24} color="inherit" /> : 'Sepete Ekle'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;