// src/components/ProductCardSkeleton.jsx

import React from 'react';
import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

const ProductCardSkeleton = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Resim için iskelet */}
      <Skeleton variant="rectangular" sx={{ height: 200 }} />
      
      <CardContent sx={{ pt: 1, pb: 1, px: 3 }}>
        {/* Marka için iskelet */}
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '40%' }} />
        {/* Ürün adı için iskelet */}
        <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '80%' }} />
      </CardContent>
      
      <Box sx={{ flexGrow: 1 }} />

      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, pb: 3 }}>
        {/* Fiyat için iskelet */}
        <Skeleton variant="text" sx={{ fontSize: '1.75rem', width: '50%', mb: 2 }} />
        {/* Buton için iskelet */}
        <Skeleton variant="rounded" sx={{ width: '100%', height: 50 }} />
      </CardActions>
    </Card>
  );
};

export default ProductCardSkeleton;