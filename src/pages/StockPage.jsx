import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getStocks } from '../services/stockService';

function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await getStocks();
        setStocks(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 'Stoklar yüklenirken bir hata oluştu.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

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
        Stok Yönetimi
      </Typography>
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
                {/* İç içe geçmiş veriye bu şekilde erişiyoruz */}
                <TableCell>{stock.urun.urun_adi}</TableCell>
                <TableCell>{stock.urun.sku}</TableCell>
                <TableCell>{stock.lokasyon.ad}</TableCell>
                <TableCell align="right">{stock.miktar}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StockPage;