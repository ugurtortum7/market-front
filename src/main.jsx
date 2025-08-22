// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles'; // Eklendi
import theme from './theme'; // Eklendi
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* Eklendi */}
      <BrowserRouter>
        <AuthProvider>
          <CartProvider> {/* YENİ PROVIDER EKLENDİ */}
          <App />
        </CartProvider> 
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider> {/* Eklendi */}
  </React.StrictMode>,
);