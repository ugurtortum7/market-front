// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { getProducts } from '../services/productService';
import { getFavorites } from '../services/favoritesService'; // Favori durumları için
import { useAuth } from '../context/AuthContext'; // Hoş geldin mesajı için

function HomePage() {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        // Öne çıkan ürünler ve favoriler için API isteklerini aynı anda yapalım
        const [productsRes, favoritesRes] = await Promise.all([
          getProducts(),
          getFavorites()
        ]);

        // Gelen ürünlerden sadece ilk 4 tanesini "Öne Çıkan" olarak alalım
        setFeaturedProducts(productsRes.data.slice(0, 4));

        // Ürün kartlarındaki kalp ikonlarının doğru olması için favori ID'lerini alalım
        const favIds = new Set(favoritesRes.data.map(fav => fav.urun.id));
        setFavoriteIds(favIds);

      } catch (error) {
        console.error("Ana sayfa verileri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  // Favori durumunu değiştirme fonksiyonu ana sayfada gerekli değil,
  // çünkü bu sayfa salt okunur bir vitrin. Bu mantık ProductsPage'de kalacak.

  return (
    <Container maxWidth="lg">
      {/* ===== 1. BÖLÜM: HERO BÖLÜMÜ ===== */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 10 }, // Dikey boşluklar
          mb: { xs: 6, md: 10 }  // Alt bölümle arasındaki boşluk
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Tazelik ve Kalite Bir Tık Uzağınızda
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
        >
          Merhaba {user.sub}, günlük ihtiyaçlarınızı kapınıza getiriyoruz. En taze ürünleri keşfedin ve alışverişin keyfini çıkarın.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={RouterLink} // Butonun bir link gibi davranmasını sağlar
          to="/urunler" // Tıklandığında ürünler sayfasına yönlendirir
          sx={{ py: 1.5, px: 5, borderRadius: '12px' }}
        >
          Alışverişe Başla
        </Button>
      </Box>

      {/* ===== 2. BÖLÜM: ÖNE ÇIKAN ÜRÜNLER ===== */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Öne Çıkan Ürünler
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {loading ? (
            // Yüklenirken 4 adet iskelet gösterelim
            Array.from(new Array(4)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <ProductCardSkeleton />
              </Grid>
            ))
          ) : (
            // Yükleme bittiğinde ürünleri gösterelim
            featuredProducts.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard 
                  product={product}
                  isFavorite={favoriteIds.has(product.id)}
                  // Ana sayfada favoriye ekleme/çıkarma yapmayacağımız için boş bir fonksiyon iletiyoruz
                  // veya bu prop'u ProductCard'da opsiyonel hale getirebiliriz.
                  onToggleFavorite={() => {}} 
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;