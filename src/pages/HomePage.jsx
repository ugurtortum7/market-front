// src/pages/HomePage.jsx

import { Box, Typography, Container } from '@mui/material';

function HomePage() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ana Sayfa
        </Typography>
        <Typography variant="body1">
          Başarıyla giriş yaptınız. Market Yönetim Sistemine hoş geldiniz!
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;