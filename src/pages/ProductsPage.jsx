// src/pages/ProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Grid, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
// ===== TASARIM GÜNCELLEMESİ: İkon Outlined versiyonu ile değiştirildi =====
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getProducts, createProduct, updateProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { uploadImage } from '../services/uploadService';
import { getFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast'; // ===== UX GÜNCELLEMESİ: Toast bildirimleri için import =====

function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    urun_adi: '', sku: '', aciklama: '', resim_url: '',
    fiyat: '', marka: '', birim: '', kategori: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, favoritesRes] = await Promise.all([
        getProducts(),
        user.rol === 'YONETICI' ? getCategories() : Promise.resolve({ data: [] }),
        getFavorites()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      const favIds = new Set(favoritesRes.data.map(fav => fav.urun.id));
      setFavoriteIds(favIds);
      setError('');
    } catch (err) { 
      setError('Veriler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  }, [user.rol]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleFavorite = async (productId, isCurrentlyFavorite) => {
    try {
      // Bildirimlerde ürün adını kullanmak için ürünü bulalım
      const product = products.find(p => p.id === productId);
      const productName = product ? product.urun_adi : 'Ürün';

      if (isCurrentlyFavorite) {
        await removeFavorite(productId);
        setFavoriteIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(productId);
          return newIds;
        });
        // ===== UX GÜNCELLEMESİ: alert yerine toast bildirimi =====
        toast.success(`${productName} favorilerden çıkarıldı.`);
      } else {
        await addFavorite(productId, { bildirim_istiyor_mu: false });
        setFavoriteIds(prevIds => new Set(prevIds).add(productId));
        // ===== UX GÜNCELLEMESİ: alert yerine toast bildirimi =====
        toast.success(`${productName} favorilere eklendi!`);
      }
    } catch (error) {
      // ===== UX GÜNCELLEMESİ: alert yerine toast bildirimi =====
      toast.error('Favori işlemi sırasında bir hata oluştu.');
      console.error('Favori değiştirme hatası:', error);
    }
  };

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
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
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
      const dataToSubmit = { ...currentProduct, fiyat: parseFloat(currentProduct.fiyat), kategori: categoryName, resim_url: imageUrl };
      
      if (isEditMode) {
        await updateProduct(currentProduct.id, dataToSubmit);
        toast.success("Ürün başarıyla güncellendi!");
      } else {
        await createProduct(dataToSubmit);
        toast.success("Ürün başarıyla eklendi!");
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'İşlem gerçekleştirilemedi.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  );
  
  const isAdmin = user.rol === 'YONETICI';

  return (
    <Box>
      {/* ===== TASARIM GÜNCELLEMESİ: Başlık ile içerik arasına boşluk artırıldı (mb: 4) ===== */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>{isAdmin ? 'Ürün Yönetimi' : 'Ürünlerimiz'}</Typography>
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
                            <TableCell align="right">{(parseFloat(p.fiyat) || 0).toFixed(2)} TL</TableCell>
                            <TableCell align="center">
                              <IconButton color="primary" onClick={() => handleOpenEditModal(p)}>
                                {/* ===== TASARIM GÜNCELLEMESİ: İkon inceltildi ===== */}
                                <EditOutlinedIcon />
                              </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      ) : (
        // ===== TASARIM GÜNCELLEMESİ: Kartlar arası boşluk artırıldı (spacing={4}) =====
        <Grid container spacing={4}>
          {products.map((product) => {
            const isFavorite = favoriteIds.has(product.id);
            return (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Grid>
            )
          })}
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
            <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth sx={{mt: 1}}>
                    Resim Değiştir/Yükle
                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                </Button>
                {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Seçilen Dosya: {selectedFile.name}</Typography>}
                {!selectedFile && currentProduct.resim_url && <Typography variant='body2' sx={{mt:1}}>Mevcut resim korunacak. Değiştirmek için yeni bir resim yükleyebilirsiniz.</Typography>}
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} name="aciklama" label="Açıklama" value={currentProduct.aciklama} onChange={handleInputChange} /></Grid>
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