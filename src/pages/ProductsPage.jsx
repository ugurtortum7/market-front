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
import { uploadImage } from '../services/uploadService'; // Yeni servisimiz
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

  // === YENİ STATE'LER ===
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditMode(true);
    const categoryId = categories.find(c => c.ad === product.kategori)?.id || '';
    setCurrentProduct({ ...product, kategori: categoryId });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      let imageUrl = currentProduct.resim_url;

      if (selectedFile) {
        const uploadResponse = await uploadImage(selectedFile);
        imageUrl = uploadResponse.data.url;
      }

      const categoryObject = categories.find(c => c.id === currentProduct.kategori);
      const categoryName = categoryObject ? categoryObject.ad : '';
      
      const dataToSubmit = {
        ...currentProduct,
        fiyat: parseFloat(currentProduct.fiyat),
        kategori: categoryName,
        resim_url: imageUrl,
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
    } finally {
      setIsUploading(false);
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
            {/* ... Yönetici Tablo Görünümü ... */}
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
            {/* ... diğer form alanları (urun_adi, marka vb.) aynı ... */}
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Resim Yükle
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>
              {selectedFile && <Typography sx={{ display: 'inline', ml: 2 }}>{selectedFile.name}</Typography>}
              {!selectedFile && currentProduct.resim_url && <Typography sx={{ display: 'inline', ml: 2 }}>Mevcut resim korunacak.</Typography>}
            </Grid>
             {/* ... açıklama alanı aynı ... */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={isUploading}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isUploading}>
            {isUploading ? <CircularProgress size={24} /> : (isEditMode ? 'Güncelle' : 'Oluştur')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductsPage;