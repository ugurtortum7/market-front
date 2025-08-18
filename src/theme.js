// src/theme.js
import { createTheme } from '@mui/material/styles';

// Kendi renklerinizi veya fontlarınızı burada tanımlayabilirsiniz
const theme = createTheme({
  palette: {
    mode: 'light', // 'light' veya 'dark' olabilir
    primary: {
      main: '#2E7D32', // Canlı bir yeşil
    },
    secondary: {
      main: '#FFC107', // Vurgu için sarı/amber
    },
    background: {
      default: '#F5F5F5', // Hafif gri arka plan
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Varsayılan font
  },
});

export default theme;