// src/pages/AdminProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Grid, FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getProducts, createProduct, updateProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';

function AdminProductsPage() {
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
      const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) { setError('Veriler yüklenirken bir hata oluştu.'); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct({ urun_adi: '', sku: '', aciklama: '', resim_url: '', fiyat: '', marka: '', birim: '', kategori: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditMode(true);
    // Kategoriyi ID'ye göre bulup state'e atıyoruz
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
        ...currentProduct,
        fiyat: parseFloat(currentProduct.fiyat),
        kategori: categoryName,
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Ürün Yönetimi</Typography>
        <Button variant="contained" onClick={handleOpenCreateModal}>Yeni Ürün Ekle</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.urun_adi}</TableCell>
                <TableCell>{p.kategori}</TableCell>
                <TableCell align="right">{(p.fiyat || 0).toFixed(2)} TL</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenEditModal(p)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
        <DialogContent>
          {/* Form içeriği bir öncekiyle aynı, sadece value'ları currentProduct'tan alıyor */}
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12} sm={6}><TextField fullWidth name="urun_adi" label="Ürün Adı" value={currentProduct.urun_adi} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth name="marka" label="Marka" value={currentProduct.marka} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth name="sku" label="SKU (Stok Kodu)" value={currentProduct.sku} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth name="birim" label="Birim (örn: 1L, 500g)" value={currentProduct.birim} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth name="fiyat" label="Fiyat" type="number" value={currentProduct.fiyat} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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

export default AdminProductsPage;