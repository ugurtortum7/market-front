// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Button, TextField, Typography, Container, Grid, Paper, CircularProgress, Alert 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Logo dosyanızın public klasöründe olduğunu varsayıyoruz
const logoUrl = 'images/tormar.png'; // Lütfen kendi logo dosyanızın adını buraya yazın

// Sol panel için yüksek çözünürlüklü bir arka plan görseli
const imageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* ===== SOL PANEL: GÖRSEL BÖLÜMÜ ===== */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ===== SAĞ PANEL: FORM BÖLÜMÜ ===== */}
      <Grid item xs={12} sm={8} md={5} component={Box} display="flex" alignItems="center">
        <Container maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Logo */}
            <Box
              component="img"
              sx={{
                height: 80,
                mb: 3,
              }}
              alt="Tormar Logo"
              src={logoUrl}
            />

            {/* Başlık ve Alt Başlık */}
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Tekrar hoş geldiniz
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Hesabınıza giriş yaparak alışverişe devam edin.
            </Typography>

            {/* Giriş Formu */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
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
              
              {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%', textAlign: 'left' }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '12px' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Hesabınız yok mu?{' '}
              <Link component={RouterLink} to="#" variant="body2">
                {"Kayıt Ol"} 
              </Link>
              {/* Not: Kayıt Ol sayfası henüz olmadığı için link '#' olarak bırakıldı. */}
            </Typography>

          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}

export default LoginPage;