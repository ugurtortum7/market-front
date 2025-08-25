// src/pages/OrdersPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Chip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getOrders, downloadInvoice } from '../services/orderService';

const formatDate = (dateString) => {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  } catch (e) {
    return "Geçersiz Tarih";
  }
};

function OrdersPage() {
  console.log("1. OrdersPage bileşeni render ediliyor.");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log("2. fetchOrders fonksiyonu çalıştı, istek gönderilecek...");
      const response = await getOrders();
      console.log("3. Backend'den cevap geldi:", response.data);
      setOrders(response.data.sort((a, b) => new Date(b.siparis_tarihi) - new Date(a.siparis_tarihi)));
      setError('');
    } catch (err) {
      console.error("HATA: Siparişler çekilirken bir sorun oluştu!", err);
      setError('Siparişler yüklenirken bir hata oluştu.');
    } finally {
      console.log("4. fetchOrders fonksiyonu tamamlandı.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("5. useEffect tetiklendi, fetchOrders çağrılacak.");
    fetchOrders();
  }, [fetchOrders]);
  
  const handleDownloadInvoice = async (orderId) => { /* ... (Bu fonksiyon aynı kalıyor) ... */ };

  console.log("6. Render bloğuna giriliyor. Yükleme durumu:", loading);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  
  console.log("7. Siparişler listelenecek. Sipariş sayısı:", orders.length);

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Siparişlerim
      </Typography>
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
              {order.detaylar.map(item => (
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