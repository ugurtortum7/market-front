// src/pages/AdminProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { getProducts, createProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    urun_adi: '',
    sku: '',
    aciklama: '',
    resim_url: '',
    fiyat: '',
    marka: '',
    birim: '',
    kategori: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      const categoryName = categories.find(c => c.id === newProduct.kategori)?.ad || '';
      const dataToSubmit = {
        ...newProduct,
        fiyat: parseFloat(newProduct.fiyat),
        kategori: categoryName,
      };
      await createProduct(dataToSubmit);
      handleClose();
      fetchData();
    } catch (err) {
      alert(`Hata: ${err.response?.data?.detail || 'Ürün oluşturulamadı.'}`);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Ürünleri Yönet</Typography>
        <Button variant="contained" onClick={handleOpen}>Yeni Ürün Ekle</Button>
      </Box>

      <TableContainer component={Paper}>
        {/* Ürünleri listeleyen tablo buraya gelecek (bir sonraki adımda detaylandırabiliriz) */}
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ürün Adı</TableCell>
                    <TableCell>Marka</TableCell>
                    <TableCell>Kategori</TableCell>
                    <TableCell>Fiyat</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {products.map(p => (
                    <TableRow key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.urun_adi}</TableCell>
                        <TableCell>{p.marka}</TableCell>
                        <TableCell>{p.kategori}</TableCell>
                        <TableCell>{p.fiyat.toFixed(2)} TL</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={6}><TextField fullWidth name="urun_adi" label="Ürün Adı" value={newProduct.urun_adi} onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth name="marka" label="Marka" value={newProduct.marka} onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth name="sku" label="SKU" value={newProduct.sku} onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth name="birim" label="Birim (örn: 1L, 500g)" value={newProduct.birim} onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth name="fiyat" label="Fiyat" type="number" value={newProduct.fiyat} onChange={handleInputChange} /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
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

export default AdminProductsPage;