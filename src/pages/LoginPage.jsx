// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react'; // useEffect'i import ediyoruz
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; // CircularProgress'i ekledik
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

// --- Stil Tanımlamaları ---
const backgroundImageStyle = { /* ... aynı kalıyor ... */ };
const formContainerStyle = { /* ... aynı kalıyor ... */ };

// --- React Bileşeni ---

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Artık token ve isLoading durumlarını da context'ten alıyoruz
  const { login, token, isLoading } = useAuth();

  // YENİ EKLENEN KISIM:
  useEffect(() => {
    // Eğer yükleme bittiyse VE kullanıcı zaten giriş yapmışsa (token varsa)...
    if (!isLoading && token) {
      // Onu ana sayfaya yönlendir. 'replace: true' geri tuşu davranışını düzeltir.
      navigate('/', { replace: true });
    }
  }, [isLoading, token, navigate]); // Bu hook, bu üç değerden biri değiştiğinde çalışır.

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginService(username, password);
      login(data);
      navigate('/');
    } catch (error) {
      console.error('Giriş Hatası:', error.message);
      alert(`Giriş Başarısız: ${error.message}`);
    }
  };

  // YENİ EKLENEN KONTROL:
  // Eğer AuthContext hala başlangıç kontrolünü yapıyorsa, formu gösterme, bekle.
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={backgroundImageStyle}>
      <Container component="main" maxWidth="xs" style={formContainerStyle}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            sx={{ height: 120, mb: 3 }}
            alt="Market Logosu"
            src="/images/logo.png"
          />
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Giriş Yap
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {/* ... TextField ve Button'lar aynı kalıyor ... */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Kullanıcı Adı"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3, mb: 2, backgroundColor: '#7ED957',
                '&:hover': { backgroundColor: '#6BC247' },
              }}
            >
              Giriş Yap
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage;