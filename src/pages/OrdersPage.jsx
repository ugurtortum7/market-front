// src/pages/OrdersPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getOrders } from '../services/orderService';

// Sipariş tarihini daha okunaklı bir formata çeviren yardımcı fonksiyon
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      // Siparişleri en yeniden en eskiye doğru sıralayalım
      setOrders(response.data.sort((a, b) => new Date(b.siparis_tarihi) - new Date(a.siparis_tarihi)));
      setError('');
    } catch (err) {
      setError('Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (orders.length === 0) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Henüz hiç sipariş vermediniz.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Siparişlerim
      </Typography>
      {orders.map((order) => (
        <Accordion key={order.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Sipariş #{order.id}</Typography>
              <Typography color="text.secondary">{formatDate(order.siparis_tarihi)}</Typography>
              <Chip label={order.durum} color="primary" variant="outlined" />
              <Typography sx={{ fontWeight: 'bold' }}>{order.toplam_tutar.toFixed(2)} TL</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'grey.50' }}>
            <Typography variant="body1" gutterBottom><strong>Teslimat Adresi:</strong> {order.teslimat_adresi}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Ürünler:</Typography>
            <ul>
              {order.detaylar.map(item => (
                <li key={item.urun.id}>
                  <Typography>
                    {item.miktar} x {item.urun.urun_adi} - ({(item.urun.fiyat * item.miktar).toFixed(2)} TL)
                  </Typography>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default OrdersPage;