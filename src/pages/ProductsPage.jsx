// src/pages/ProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Grid, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getProducts, createProduct, updateProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    urun_adi: '', sku: '', aciklama: '', resim_url: '',
    fiyat: '', marka: '', birim: '', kategori: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        user.rol === 'YONETICI' ? getCategories() : Promise.resolve({ data: [] })
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) { setError('Veriler yüklenirken bir hata oluştu.'); }
    finally { setLoading(false); }
  }, [user.rol]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct({ urun_adi: '', sku: '', aciklama: '', resim_url: '', fiyat: '', marka: '', birim: '', kategori: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditMode(true);
    const categoryId = categories.find(c => c.ad === product.kategori)?.id || '';
    setCurrentProduct({ ...product, kategori: categoryId });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const categoryObject = categories.find(c => c.id === currentProduct.kategori);
      const categoryName = categoryObject ? categoryObject.ad : '';
      const dataToSubmit = {
        urun_adi: currentProduct.urun_adi, sku: currentProduct.sku, aciklama: currentProduct.aciklama,
        resim_url: currentProduct.resim_url, fiyat: parseFloat(currentProduct.fiyat), marka: currentProduct.marka,
        birim: currentProduct.birim, kategori: categoryName,
      };

      if (isEditMode) {
        await updateProduct(currentProduct.id, dataToSubmit);
      } else {
        await createProduct(dataToSubmit);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      alert(`Hata: ${err.response?.data?.detail || 'İşlem gerçekleştirilemedi.'}`);
    }
  };

  if (loading) return <CircularProgress />;

  const isAdmin = user.rol === 'YONETICI';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>{isAdmin ? 'Ürün Yönetimi' : 'Ürünlerimiz'}</Typography>
        {isAdmin && (<Button variant="contained" onClick={handleOpenCreateModal}>Yeni Ürün Ekle</Button>)}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {isAdmin ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resim</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell align="right">Fiyat</TableCell>
                <TableCell align="center">Düzenle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id}>
                  <TableCell><Box component="img" sx={{ height: 50, width: 50, objectFit: 'cover', borderRadius: '4px' }} alt={p.urun_adi} src={p.resim_url || 'https://via.placeholder.com/50'} /></TableCell>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.urun_adi}</TableCell>
                  <TableCell>{p.kategori}</TableCell>
                  <TableCell align="right">{(p.fiyat || 0).toFixed(2)} TL</TableCell>
                  <TableCell align="center"><IconButton color="primary" onClick={() => handleOpenEditModal(p)}><EditIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12} sm={6}><TextField fullWidth required name="urun_adi" label="Ürün Adı" value={currentProduct.urun_adi} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required name="marka" label="Marka" value={currentProduct.marka} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required name="sku" label="SKU (Stok Kodu)" value={currentProduct.sku} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required name="birim" label="Birim (örn: 1L, 500g)" value={currentProduct.birim} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required name="fiyat" label="Fiyat" type="number" value={currentProduct.fiyat} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select name="kategori" label="Kategori" value={currentProduct.kategori} onChange={handleInputChange}>
                  {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.ad}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth name="resim_url" label="Resim URL" value={currentProduct.resim_url} onChange={handleInputChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} name="aciklama" label="Açıklama" value={currentProduct.aciklama} onChange={handleInputChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">{isEditMode ? 'Güncelle' : 'Oluştur'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductsPage;