// src/components/Footer.jsx

import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto', // Bu, sayfa içeriği kısa olsa bile footer'ı en alta iter
        backgroundColor: 'background.default', // Temamızdaki arka plan rengi
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {'© '}
            {new Date().getFullYear()}
            {' Market | Tüm Hakları Saklıdır.'}
          </Typography>
          <Box>
            <IconButton aria-label="facebook" color="inherit" component="a" href="https://facebook.com">
              <FacebookOutlinedIcon />
            </IconButton>
            <IconButton aria-label="twitter" color="inherit" component="a" href="https://twitter.com">
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="instagram" color="inherit" component="a" href="https://instagram.com">
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;