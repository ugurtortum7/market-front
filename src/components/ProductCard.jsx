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
        
        {/* ===== GÜNCELLENEN KISIM BAŞLANGICI ===== */}
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.urun_adi}
          sx={{
            height: 200, // Resim alanının yüksekliği
            // Bu özellik, resmin orantısını bozmadan kutuya tam sığmasını sağlar.
            objectFit: 'contain', 
            // Resmin arkasında hafif bir arka plan rengi olması, boşlukların sırıtmasını engeller.
            bgcolor: 'grey.100' 
          }}
        />
        {/* ===== GÜNCELLENEN KISIM BİTİŞİ ===== */}

        <CardContent sx={{ width: '100%' }}>
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
      <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
          {(product.fiyat || 0).toFixed(2)} TL
        </Typography>
        <Button size="small" variant="contained" color="primary" onClick={handleAddToCart}>
          Sepete Ekle
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;