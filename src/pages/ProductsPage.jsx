// src/pages/ProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getProducts } from '../services/productService';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 'Ürünler yüklenirken bir hata oluştu.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Boş dependency array, bu effect'in sadece bileşen ilk render edildiğinde çalışmasını sağlar.

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ürün Yönetimi
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
    </Box>
  );
}

export default ProductsPage;