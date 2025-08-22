// src/components/ProductCard.jsx

import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

const ProductCard = ({ product }) => {
  const imageUrl = product.resim_url || 'https://via.placeholder.com/300x200.png?text=Urun+Resmi';

  const handleAddToCart = () => {
    alert(`"${product.urun_adi}" sepete eklendi! (Henüz işlem yapmıyor)`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Box sx={{
          width: '100%',
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          bgcolor: '#fff',
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
        
        {/* ===== GÜNCELLENEN KISIM BAŞLANGICI ===== */}
        <CardContent sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.marka}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" sx={{ minHeight: 64 }}>
            {product.urun_adi}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.birim}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ 
        p: 2, 
        display: 'flex', 
        // justifyContent'i 'space-between' yerine 'center' yapıyoruz
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column' // Fiyat ve butonu alt alta getirelim
      }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 1 }}>
          {(product.fiyat || 0).toFixed(2)} TL
        </Typography>
        <Button size="small" variant="contained" color="primary" onClick={handleAddToCart}>
          Sepete Ekle
        </Button>
      </CardActions>
      {/* ===== GÜNCELLENEN KISIM BİTİŞİ ===== */}
    </Card>
  );
};

export default ProductCard;