// src/pages/FavoritesPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import { getFavorites } from '../services/favoritesService';
import ProductCard from '../components/ProductCard'; // Ürün kartı bileşenini yeniden kullanacağız

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await getFavorites();
        // API'den dönen listedeki her bir favori objesini alıyoruz
        setFavorites(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 'Favoriler yüklenirken bir hata oluştu.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Favorilerim
      </Typography>
      {favorites.length === 0 ? (
        <Typography>Henüz favorilerinize eklenmiş bir ürün bulunmuyor.</Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favoriteItem) => (
            <Grid item key={favoriteItem.id} xs={12} sm={6} md={4} lg={3}>
              {/* ProductCard bileşenine favori objesinin içindeki 'urun' nesnesini gönderiyoruz */}
              <ProductCard product={favoriteItem.urun} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default FavoritesPage;