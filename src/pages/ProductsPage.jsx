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
  const { user } = useAuth(); // Kullanıcı rolünü kontrol etmek için

  // Modal'ın durumu için state'ler
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    urun_adi: '',
    aciklama: '',
    fiyat: 0,
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateProduct = async () => {
    try {
      const dataToSubmit = { ...newProduct, fiyat: parseFloat(newProduct.fiyat) };
      await createProduct(dataToSubmit);
      handleClose(); // Modal'ı kapat
      fetchProducts(); // Ürün listesini yenile!
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Ürün oluşturulamadı.';
      alert(`Hata: ${errorMessage}`); // Hata durumunda kullanıcıyı bilgilendir
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
      
      {/* Ürünleri Listeleme Tablosu */}
      <TableContainer component={Paper}>
        {/* ... Tablo kodu aynı kalıyor ... */}
      </TableContainer>

      {/* Yeni Ürün Ekleme Modalı (Dialog) */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="urun_adi"
            label="Ürün Adı"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="aciklama"
            label="Açıklama"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="fiyat"
            label="Fiyat"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleCreateProduct}>Oluştur</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductsPage;