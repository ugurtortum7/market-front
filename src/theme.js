// src/theme.js

import { createTheme } from '@mui/material/styles';

// Apple estetiğini yansıtan özel tema ayarlarımız
const theme = createTheme({
  // ### Renk Paleti: Minimalist, Beyaz ve Nötr Tonlar ###
  palette: {
    mode: 'light',
    primary: {
      main: '#1d1d1f', // Apple'ın kullandığı siyaha yakın, güçlü bir gri
    },
    secondary: {
      main: '#6e6e73', // İkincil metinler için yumuşak bir gri
    },
    background: {
      default: '#f5f5f7', // Göz yormayan, Apple'ın sıkça kullandığı hafif kırık beyaz
      paper: '#ffffff',   // Kartlar ve diyalog pencereleri için saf beyaz
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#6e6e73',
    },
  },

  // ### Tipografi: Sade ve Zarif (San Francisco Benzeri) ###
  typography: {
    fontFamily: [
      '-apple-system',      // Apple cihazlarda San Francisco fontunu kullanır
      'BlinkMacSystemFont', // Diğer Mac'lerde benzerini kullanır
      '"Segoe UI"',        // Windows'ta Segoe UI'ı kullanır
      'Roboto',             // Android ve ChromeOS'ta Roboto'yu kullanır
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600, // Başlıklar için daha zarif bir kalınlık
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },

  // ### Bileşenler: Yuvarlak Kenarlar, Yumuşak Gölgeler, İnce Detaylar ###
  components: {
    // Tüm Kartlar için standart stil
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Daha belirgin, yumuşak köşe yuvarlaklığı
          border: '1px solid rgba(0, 0, 0, 0.08)', // Çok ince bir kenarlık
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)', // Yumuşak ve doğal gölge
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
             // Hover efekti biraz daha belirgin ama hala yumuşak
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    // Tüm Butonlar için standart stil
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Kartlarla uyumlu köşe yuvarlaklığı
          textTransform: 'none', // Apple butonları büyük harf kullanmaz
          fontWeight: 600,
        },
        // Contained (dolu) butonlar için özel gölge
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    // AppBar (Üst Menü) için stil
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Hafif transparan, modern bir görünüm
                backdropFilter: 'blur(10px)', // Arka planı bulanıklaştırır (Safari, Chrome destekli)
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                color: '#1d1d1f' // AppBar içindeki yazı rengi
            }
        }
    }
  },
});

export default theme;