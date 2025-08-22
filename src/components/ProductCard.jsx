// src/components/ProductCard.jsx

import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

const ProductCard = ({ product }) => {
  const imageUrl = product.resim_url || 'https://via.placeholder.com/300x200.png?text=Urun+Resmi';

  const handleAddToCart = () => {
    alert(`"${product.urun_adi}" sepete eklendi! (Henüz işlem yapmıyor)`);
  };

  return (
    // Ana Kart: Gölge, yuvarlak kenarlar ve dikey hizalama için flexbox
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center', // İçindeki tüm metinleri ortala
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Hafif gölge
      borderRadius: '1rem', // 16px yuvarlak kenar
    }}>
      
      {/* Resim Alanı */}
      <Box sx={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2, // Resmin kenarlarında biraz boşluk bırak
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
      <CardContent sx={{
        flexGrow: 1, // Bu alanın esneyip fiyat/butonu aşağı itmesini sağlar
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center' // Dikeyde de içeriği ortalamaya yardımcı olur
      }}>
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
      
      {/* Fiyat ve Buton Alanı */}
      <CardActions sx={{
        display: 'flex',
        flexDirection: 'column', // Alt alta ortalamak için
        alignItems: 'center', // Yatayda ortalamak için
        p: 2,
      }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 1.5 }}>
          {(product.fiyat || 0).toFixed(2)} TL
        </Typography>
        <Button 
          fullWidth // Butonun genişliğini doldurmasını sağlar
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