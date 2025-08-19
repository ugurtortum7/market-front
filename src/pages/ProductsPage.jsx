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

  // Modal'ın durumu için state'ler
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    urun_adi: '',
    aciklama: '',
    fiyat: '', // Boş string olarak başlatmak daha iyi
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError(''); // Başarılı olunca eski hataları temizle
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
    // Modal açıldığında formu temizle
    setNewProduct({ urun_adi: '', aciklama: '', fiyat: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateProduct = async () => {
    try {
      const dataToSubmit = { ...newProduct, fiyat: parseFloat(newProduct.fiyat) };

      if (isNaN(dataToSubmit.fiyat)) {
        alert('Hata: Fiyat geçerli bir sayı olmalıdır.');
        return;
      }

      await createProduct(dataToSubmit);
      handleClose();
      fetchProducts();
    } catch (err) {
      let errorMessage = 'Bilinmeyen bir hata oluştu.';
    
      if (err.response && err.response.data && err.response.data.detail) {
        const errorDetail = err.response.data.detail;
        if (Array.isArray(errorDetail)) {
          // FastAPI validasyon hatası (örn: {'loc': ['body', 'fiyat'], 'msg': '...'})
          errorMessage = `${errorDetail[0].loc[1]} alanında hata: ${errorDetail[0].msg}`;
        } else {
          // Genel hata mesajı (string)
          errorMessage = errorDetail;
        }
      } else if (err.message) {
        // Axios veya ağ hatası
        errorMessage = err.message;
      }
      
      alert(`Hata: ${errorMessage}`);
      console.error("Ürün oluşturma hatası:", err.response || err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Ürün Yönetimi
        </Typography>
        {user.rol === 'YONETICI' && (
          <Button variant="contained" onClick={handleOpen}>
            Yeni Ürün Ekle
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell align="right">Fiyat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.id}
                </TableCell>
                <TableCell>{product.urun_adi}</TableCell>
                <TableCell>{product.aciklama}</TableCell>
                <TableCell align="right">{product.fiyat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="urun_adi"
            label="Ürün Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.urun_adi}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="aciklama"
            label="Açıklama"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.aciklama}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="fiyat"
            label="Fiyat"
            type="number"
            fullWidth
            variant="outlined"
            value={newProduct.fiyat}
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