// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// ===== TASARIM İÇİN EKLENENLER (1/3) =====
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Oluşturduğumuz tema dosyasını import ediyoruz

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* ===== TASARIM İÇİN EKLENENLER (2/3) ===== */}
          {/* ThemeProvider, tüm uygulamayı özel temamızla sarmalar */}
          <ThemeProvider theme={theme}>
            {/* CssBaseline, tarayıcı stillerini sıfırlar ve arka plan rengi gibi temel ayarları uygular */}
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);