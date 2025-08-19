// src/pages/ProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions 
} from '@mui/material';
import { getProducts, createProduct } from '../services/productService';
import { useAuth } from '../context/AuthContext';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  // ===== DEĞİŞİKLİK 1: Form state'i güncellendi (fiyat gitti, sku geldi) =====
  const [newProduct, setNewProduct] = useState({
    urun_adi: '',
    aciklama: '',
    sku: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Ürünler yüklenirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpen = () => {
    setNewProduct({ urun_adi: '', aciklama: '', sku: '' }); // Formu temizle
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateProduct = async () => {
    try {
      // ===== DEĞİŞİKLİK 2: Fiyat parse etme işlemi kaldırıldı =====
      await createProduct(newProduct);
      handleClose();
      fetchProducts();
    } catch (err) {
      let errorMessage = 'Bilinmeyen bir hata oluştu.';
      if (err.response && err.response.data && err.response.data.detail) {
        const errorDetail = err.response.data.detail;
        if (Array.isArray(errorDetail)) {
          errorMessage = `${errorDetail[0].loc[1]} alanında hata: ${errorDetail[0].msg}`;
        } else {
          errorMessage = errorDetail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      alert(`Hata: ${errorMessage}`);
      console.error("Ürün oluşturma hatası:", err.response || err);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Ürün Yönetimi</Typography>
        {user.rol === 'YONETICI' && <Button variant="contained" onClick={handleOpen}>Yeni Ürün Ekle</Button>}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              {/* ===== DEĞİŞİKLİK 3: Tablo başlığı güncellendi ===== */}
              <TableCell>SKU</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{product.id}</TableCell>
                <TableCell>{product.urun_adi}</TableCell>
                <TableCell>{product.aciklama}</TableCell>
                {/* ===== DEĞİŞİKLİK 4: Tablo içeriği güncellendi ===== */}
                <TableCell>{product.sku}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="urun_adi" label="Ürün Adı" type="text" fullWidth variant="outlined" value={newProduct.urun_adi} onChange={handleInputChange} sx={{ mb: 2 }}/>
          <TextField margin="dense" name="aciklama" label="Açıklama" type="text" fullWidth variant="outlined" value={newProduct.aciklama} onChange={handleInputChange} sx={{ mb: 2 }}/>
          {/* ===== DEĞİŞİKLİK 5: Form alanı güncellendi ===== */}
          <TextField margin="dense" name="sku" label="SKU" type="text" fullWidth variant="outlined" value={newProduct.sku} onChange={handleInputChange} />
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