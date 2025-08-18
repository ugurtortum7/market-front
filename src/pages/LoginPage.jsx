// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
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
  padding: '16px', // Küçük ekranlarda kenar boşluğu için
};

const formContainerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)', // Şeffaflığı biraz azalttık
  padding: '32px',
  borderRadius: '16px', // Daha yuvarlak kenarlar
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Daha belirgin gölge
  backdropFilter: 'blur(4px)', // Arka planı hafifçe bulanıklaştırır (tarayıcı desteğine bağlı)
};


// --- React Bileşeni ---

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const data = await loginService(username, password);
      login(data); // Token'ı context'e ve localStorage'a kaydet
      navigate('/'); // Ana sayfaya yönlendir
    } catch (error) {
      console.error('Giriş Hatası:', error.message);
      alert(`Giriş Başarısız: ${error.message}`);
    }
  };

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
              sx={{ mt: 3, mb: 2 }}
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