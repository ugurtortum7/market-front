// src/components/ProductCard.jsx

import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext'; // Sepet context'ini import ediyoruz

const ProductCard = ({ product }) => {
  const imageUrl = product.resim_url || 'https://via.placeholder.com/300x200.png?text=Urun+Resmi';
  const { addToCart } = useCart(); // Global addToCart fonksiyonunu context'ten alıyoruz
  const [isAdding, setIsAdding] = useState(false); // Buton için yükleme durumu

const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      // Backend'den gelen detaylı hata mesajını yakala ve göster
      const errorMessage = error.response?.data?.detail || "Ürün sepete eklenemedi. Lütfen tekrar deneyin.";
      alert(errorMessage);
      console.error(error);
    } finally {
      setIsAdding(false);
    }
};

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderRadius: '12px',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }
    }}>
      
      <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.urun_adi}
          sx={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }}
        />
      </Box>
      
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
          {product.marka}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" sx={{ lineHeight: 1.2, height: '3.6em' }}>
          {product.urun_adi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.birim}
        </Typography>
      </CardContent>
      
      <Box sx={{ flexGrow: 1 }} />

      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, pb: 2 }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 1.5 }}>
          {(product.fiyat || 0).toFixed(2)} TL
        </Typography>
        <Button 
          fullWidth
          size="medium" 
          variant="contained" 
          color="primary" 
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? <CircularProgress size={24} color="inherit" /> : 'Sepete Ekle'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;