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
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={product.urun_adi}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.marka}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {product.urun_adi}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.birim}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ mt: 'auto', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
          {/* Fiyatın null/undefined olma ihtimaline karşı kontrol ekleyelim */}
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