// src/pages/CategoryPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions 
} from '@mui/material';
import { getCategories, createCategory } from '../services/categoryService'; // createCategory eklendi
import { useAuth } from '../context/AuthContext';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Yönetici kontrolü için user alındı

  // Yeni kategori ekleme modali için state'ler
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Kategoriler yüklenirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Modal'ı açma/kapama fonksiyonları
  const handleOpen = () => {
    setNewCategoryName(''); // Formu temizle
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Form gönderme fonksiyonu
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Kategori adı boş olamaz.");
      return;
    }
    try {
      await createCategory({ ad: newCategoryName });
      handleClose(); // Modalı kapat
      fetchCategories(); // Listeyi yenile
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Kategori oluşturulamadı.';
      alert(`Hata: ${errorMessage}`);
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
          Kategori Yönetimi
        </Typography>
        {/* Sadece yöneticilerin görebileceği buton */}
        {user.rol === 'YONETICI' && (
          <Button variant="contained" onClick={handleOpen}>
            Yeni Kategori Ekle
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Kategori Adı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell component="th" scope="row">{category.id}</TableCell>
                <TableCell>{category.ad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Yeni Kategori Ekleme Modalı */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Kategori Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Kategori Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleCreateCategory} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryPage;