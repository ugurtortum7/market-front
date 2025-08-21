// src/pages/ProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Grid, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { getProducts, createProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const { user } = useAuth(); // Rol kontrolü için
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false); // Modal için state
  const [newProduct, setNewProduct] = useState({
    urun_adi: '', sku: '', aciklama: '', resim_url: '',
    fiyat: '', marka: '', birim: '', kategori: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Kategorileri sadece yöneticiyse çek, performansı artır
      const productPromise = getProducts();
      const categoryPromise = user.rol === 'YONETICI' ? getCategories() : Promise.resolve({ data: [] });

      const [productsRes, categoriesRes] = await Promise.all([productPromise, categoryPromise]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [user.rol]); // user.rol değiştiğinde yeniden çek

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpen = () => {
    setNewProduct({ urun_adi: '', sku: '', aciklama: '', resim_url: '', fiyat: '', marka: '', birim: '', kategori: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateProduct = async () => {
    // ... (Bu fonksiyon bir önceki cevaptakiyle aynı, hata ayıklaması yapılmış)
    try {
      const categoryObject = categories.find(c => c.id === newProduct.kategori);
      const categoryName = categoryObject ? categoryObject.ad : '';

      const dataToSubmit = {
        urun_adi: newProduct.urun_adi, sku: newProduct.sku, aciklama: newProduct.aciklama,
        resim_url: newProduct.resim_url, fiyat: parseFloat(newProduct.fiyat), marka: newProduct.marka,
        birim: newProduct.birim, kategori: categoryName,
      };

      if (!dataToSubmit.urun_adi || !dataToSubmit.fiyat || !dataToSubmit.marka || !dataToSubmit.kategori) {
         alert("Lütfen zorunlu alanları doldurun.");
         return;
      }
      if (isNaN(dataToSubmit.fiyat)) {
         alert('Lütfen geçerli bir fiyat girin.');
         return;
      }

      await createProduct(dataToSubmit);
      handleClose();
      fetchData();
    } catch (err) {
      alert(`Hata: ${err.response?.data?.detail || 'Ürün oluşturulamadı.'}`);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Ürünler</Typography>
        {/* YÖNETİCİYE ÖZEL BUTON */}
        {user.rol === 'YONETICI' && (
          <Button variant="contained" onClick={handleOpen}>
            Yeni Ürün Ekle
          </Button>
        )}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Ürün Ekleme Formu (Modal) */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
              <Grid item xs={12} sm={6}><TextField fullWidth required name="urun_adi" label="Ürün Adı" value={newProduct.urun_adi} onChange={handleInputChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth required name="marka" label="Marka" value={newProduct.marka} onChange={handleInputChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth required name="sku" label="SKU (Stok Kodu)" value={newProduct.sku} onChange={handleInputChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth required name="birim" label="Birim (örn: 1L, 500g)" value={newProduct.birim} onChange={handleInputChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth required name="fiyat" label="Fiyat" type="number" value={newProduct.fiyat} onChange={handleInputChange} /></Grid>
              <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                      <InputLabel>Kategori</InputLabel>
                      <Select name="kategori" label="Kategori" value={newProduct.kategori} onChange={handleInputChange}>
                          {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.ad}</MenuItem>)}
                      </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={12}><TextField fullWidth name="resim_url" label="Resim URL" value={newProduct.resim_url} onChange={handleInputChange} /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={3} name="aciklama" label="Açıklama" value={newProduct.aciklama} onChange={handleInputChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleCreateProduct} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductsPage;