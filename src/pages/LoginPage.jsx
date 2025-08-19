// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

// --- Stil Tanımlamaları ---

const backgroundImageStyle = {
  backgroundImage: `url('/images/login-background.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
};

const formContainerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(4px)',
};


// --- React Bileşeni ---

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, token, isLoading } = useAuth();

  useEffect(() => {
    // Yükleme bittiyse ve kullanıcı zaten giriş yapmışsa (token varsa), ana sayfaya yönlendir.
    if (!isLoading && token) {
      navigate('/', { replace: true });
    }
  }, [isLoading, token, navigate]);

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
            sx={{
              height: 300,
              mb: 1,
            }}
            alt="Market Logosu"
            src="/images/tormar.png"
          />
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Giriş Yap
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                mt: 3,
                mb: 2,
                backgroundColor: '#7ED957', // Örnek renk
                '&:hover': {
                  backgroundColor: '#6BC247', // Örnek rengin koyu tonu
                },
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