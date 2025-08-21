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
          {/* YENİ EKLENEN MARKA BİLGİSİ */}
          <Typography variant="body2" color="text.secondary">
            {product.marka}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {product.urun_adi}
            {/* YENİ EKLENEN BİRİM BİLGİSİ */}
            <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
              ({product.birim})
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.aciklama}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* Kartın alt kısmı güncellendi */}
      <CardActions sx={{ mt: 'auto', p: 2, display: 'flex', justifyContent: 'space-between' }}>
        {/* YENİ EKLENEN FİYAT BİLGİSİ */}
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
          {product.fiyat.toFixed(2)} TL
        </Typography>
        <Button size="small" variant="contained" color="primary" onClick={handleAddToCart}>
          Sepete Ekle
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;