// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Button, TextField, Typography, Container, Link, CircularProgress, Alert 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Logo ve Arka Plan dosya yolları
const logoUrl = '/images/tormar.png';
const imageUrl = '/images/login-background.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext'ten gelen yeni, async login fonksiyonu

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Artık API isteği burada değil, AuthContext içinde yapılıyor.
      // Biz sadece kullanıcı adı ve şifreyi gönderiyoruz.
      await login(username, password);
      navigate('/'); // Başarılı olursa ana sayfaya yönlendir
    } catch (err) {
      // Hata AuthContext'ten yakalanıp buraya geri gönderiliyor.
      const errorMessage = err.response?.data?.detail || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Ana kapsayıcı: Ekranı kaplayan bir flexbox yapısı
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* SOL PANEL: GÖRSEL BÖLÜMÜ */}
      <Box 
        sx={{ 
          width: '50%', 
          display: { xs: 'none', md: 'block' },
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} 
      />

      {/* SAĞ PANEL: FORM BÖLÜMÜ */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Box
              component="img"
              sx={{ height: 140, mb: 4 }}
              alt="Tormar Logo"
              src={logoUrl}
            />

            <Typography component="h1" variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Tekrar hoş geldiniz
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Hesabınıza giriş yaparak alışverişe devam edin.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField margin="normal" required fullWidth id="username" label="Kullanıcı Adı" name="username" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField margin="normal" required fullWidth name="password" label="Şifre" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%', textAlign: 'left' }}>{error}</Alert>
              )}

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '12px' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Hesabınız yok mu?{' '}
              <Link component={RouterLink} to="#" variant="body2" sx={{ fontWeight: 500 }}>
                {"Kayıt Ol"} 
              </Link>
            </Typography>

          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LoginPage;