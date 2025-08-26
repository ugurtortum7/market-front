// src/pages/OrdersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Chip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getOrders, downloadInvoice } from '../services/orderService';

const formatDate = (dateString) => {
  if (!dateString) return "Tarih bilgisi yok";
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  } catch (e) {
    return "Geçersiz Tarih";
  }
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data || []);
      setError('');
    } catch (err) {
      setError('Siparişler yüklenirken bir hata oluştu.');
      console.error("Sipariş getirme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await downloadInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fatura-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Fatura indirilirken bir hata oluştu. Lütfen yöneticinize başvurun.");
      console.error("Fatura indirme hatası:", err);
    }
  };
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Alert severity="error" sx={{m: 2}}>{error}</Alert>;
  }
  
  if (!orders || orders.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Henüz hiç sipariş vermediniz.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Siparişlerim</Typography>
      {orders.map((order) => (
        <Accordion key={order.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Sipariş #{order.id}</Typography>
              <Typography color="text.secondary">{formatDate(order.siparis_tarihi)}</Typography>
              <Chip label={order.durum} color="primary" variant="outlined" />
              <Typography sx={{ fontWeight: 'bold', ml: 'auto' }}>
                {(parseFloat(order.toplam_tutar) || 0).toFixed(2)} TL
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.50' }}>
            <Typography variant="body1" gutterBottom><strong>Teslimat Adresi:</strong> {order.teslimat_adresi}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Ürünler:</Typography>
            <ul>
              {order.detaylar && order.detaylar.map(item => (
                item.urun && (
                  <li key={item.urun.id}>
                    <Typography>
                      {item.miktar} x {item.urun.urun_adi} - 
                      ( {(parseFloat(item.urun_fiyati) * item.miktar || 0).toFixed(2)} TL )
                    </Typography>
                  </li>
                )
              ))}
            </ul>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={() => handleDownloadInvoice(order.id)}
              >
                Faturayı İndir
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default OrdersPage;