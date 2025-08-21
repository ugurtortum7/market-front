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
  const [newProduct, setNewProduct] = useState({
    urun_adi: '',
    aciklama: '',
    sku: '',
    resim_url: '', // <-- DEĞİŞİKLİK: resim_url state'e eklendi
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
    setNewProduct({ urun_adi: '', aciklama: '', sku: '', resim_url: '' }); // <-- DEĞİŞİKLİK: Formu temizlerken resim_url de sıfırlandı
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      handleClose();
      fetchProducts();
    } catch (err) {
      let errorMessage = 'Bilinmeyen bir hata oluştu.';
      if (err.response?.data?.detail) {
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
              {/* <-- DEĞİŞİKLİK: Resim sütunu eklendi --> */}
              <TableCell sx={{ width: '10%' }}>Resim</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>SKU</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                 {/* <-- DEĞİŞİKLİK: Resim hücresi eklendi --> */}
                <TableCell>
                  <Box
                    component="img"
                    sx={{ height: 50, width: 50, objectFit: 'cover', borderRadius: '4px' }}
                    alt={product.urun_adi}
                    src={product.resim_url || 'https://via.placeholder.com/50'}
                  />
                </TableCell>
                <TableCell component="th" scope="row">{product.id}</TableCell>
                <TableCell>{product.urun_adi}</TableCell>
                <TableCell>{product.aciklama}</TableCell>
                <TableCell>{product.sku}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="urun_adi" label="Ürün Adı" type="text" fullWidth variant="outlined" value={newProduct.urun_adi} onChange={handleInputChange} sx={{ mt: 1, mb: 2 }}/>
          <TextField margin="dense" name="aciklama" label="Açıklama" type="text" fullWidth variant="outlined" value={newProduct.aciklama} onChange={handleInputChange} sx={{ mb: 2 }}/>
          <TextField margin="dense" name="sku" label="SKU" type="text" fullWidth variant="outlined" value={newProduct.sku} onChange={handleInputChange} sx={{ mb: 2 }}/>
          {/* <-- DEĞİŞİKLİK: Resim URL alanı forma eklendi --> */}
          <TextField
            margin="dense"
            name="resim_url"
            label="Resim URL"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.resim_url}
            onChange={handleInputChange}
          />
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