// src/pages/StockPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { getStocks, createStock } from '../services/stockService';
import { getProducts } from '../services/productService';
import { getLocations } from '../services/locationService';
import { useAuth } from '../context/AuthContext';

function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    urun_id: '',
    lokasyon_id: '',
    miktar: '',
  });

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [stocksRes, productsRes, locationsRes] = await Promise.all([
        getStocks(),
        getProducts(),
        getLocations()
      ]);
      setStocks(stocksRes.data);
      setProducts(productsRes.data);
      setLocations(locationsRes.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Veriler yüklenirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleOpen = () => {
    setNewStock({ urun_id: '', lokasyon_id: '', miktar: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateStock = async () => {
    try {
      const dataToSubmit = {
        ...newStock,
        miktar: parseInt(newStock.miktar, 10),
        urun_id: parseInt(newStock.urun_id, 10),
        lokasyon_id: parseInt(newStock.lokasyon_id, 10),
      };
      await createStock(dataToSubmit);
      handleClose();
      fetchInitialData();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Stok kaydı oluşturulamadı.';
      alert(`Hata: ${errorMessage}`);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Stok Yönetimi</Typography>
        {user.rol === 'YONETICI' && <Button variant="contained" onClick={handleOpen}>Yeni Stok Kaydı Ekle</Button>}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="stock table">
          <TableHead>
            <TableRow>
              <TableCell>Stok ID</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Lokasyon</TableCell>
              <TableCell align="right">Miktar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow
                key={stock.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {stock.id}
                </TableCell>
                {/* ===== GÜNCELLENEN KISIM BAŞLANGICI ===== */}
                <TableCell>{stock.urun?.urun_adi || 'Bilinmeyen Ürün'}</TableCell>
                <TableCell>{stock.urun?.sku || 'N/A'}</TableCell>
                <TableCell>{stock.lokasyon?.ad || 'Bilinmeyen Lokasyon'}</TableCell>
                {/* ===== GÜNCELLENEN KISIM BİTİŞİ ===== */}
                <TableCell align="right">{stock.miktar}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Stok Kaydı Oluştur</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="product-select-label">Ürün</InputLabel>
            <Select
              labelId="product-select-label"
              name="urun_id"
              value={newStock.urun_id}
              label="Ürün"
              onChange={handleInputChange}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.urun_adi} (SKU: {product.sku})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location-select-label">Lokasyon</InputLabel>
            <Select
              labelId="location-select-label"
              name="lokasyon_id"
              value={newStock.lokasyon_id}
              label="Lokasyon"
              onChange={handleInputChange}
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.ad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="miktar"
            label="Miktar"
            type="number"
            fullWidth
            variant="outlined"
            value={newStock.miktar}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleCreateStock} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StockPage;