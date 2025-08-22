// src/components/ProductCard.jsx

import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

const ProductCard = ({ product }) => {
  const imageUrl = product.resim_url || 'https://via.placeholder.com/300x200.png?text=Urun+Resmi';

  const handleAddToCart = () => {
    alert(`"${product.urun_adi}" sepete eklendi! (Henüz işlem yapmıyor)`);
  };

  return (
    // Ana Kart: Yüksekliği %100 yaparak grid'deki diğer kartlarla eşitlenmesini sağlıyoruz.
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
      
      {/* Resim Alanı */}
      <Box sx={{
        height: 180, // Sabit resim alanı yüksekliği
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.urun_adi}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
      
      {/* Metin İçerik Alanı */}
      <CardContent sx={{ pt: 1, pb: 1 }}> {/* Dikey boşluk azaltıldı */}
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
      
      {/* === GÖRÜNMEZ İTİCİ === */}
      {/* Bu boş kutu, kalan tüm dikey boşluğu doldurarak aşağıdaki alanı en alta iter. */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Fiyat ve Buton Alanı */}
      <CardActions sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2, // Yatay padding
        pb: 2, // Alttan padding
      }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 1.5 }}>
          {(product.fiyat || 0).toFixed(2)} TL
        </Typography>
        <Button 
          fullWidth
          size="medium" 
          variant="contained" 
          color="primary" 
          onClick={handleAddToCart}
        >
          Sepete Ekle
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;