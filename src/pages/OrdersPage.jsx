// src/pages/OrdersPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Chip, Button } from '@mui/material'; // Button eklendi
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // İkon eklendi
import { getOrders, downloadInvoice } from '../services/orderService'; // downloadInvoice eklendi

// ... formatDate fonksiyonu ...

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ... fetchOrders fonksiyonu aynı ...

  // YENİ EKLENDİ: Fatura indirme fonksiyonu
  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await downloadInvoice(orderId);
      // Gelen dosya verisinden (blob) bir URL oluştur
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Gizli bir link elementi oluştur
      const link = document.createElement('a');
      link.href = url;
      // İndirilecek dosyanın adını belirle
      link.setAttribute('download', `fatura-${orderId}.pdf`);
      // Linki DOM'a ekle ve tıkla
      document.body.appendChild(link);
      link.click();
      // Linki temizle
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Fatura indirilirken bir hata oluştu. Lütfen yöneticinize başvurun.");
      console.error("Fatura indirme hatası:", err);
    }
  };

  // ... if (loading), if (error), if (orders.length === 0) blokları aynı ...

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Siparişlerim</Typography>
      {orders.map((order) => (
        <Accordion key={order.id}>
          {/* ... AccordionSummary aynı ... */}
          <AccordionDetails sx={{ backgroundColor: 'grey.50' }}>
            <Typography variant="body1" gutterBottom><strong>Teslimat Adresi:</strong> {order.teslimat_adresi}</Typography>
            {/* ... Ürünler listesi aynı ... */}
            
            {/* YENİ EKLENEN FATURA BUTONU */}
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