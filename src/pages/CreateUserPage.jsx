// src/pages/CreateUserPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { createUser } from '../services/userService'; // Yeni servis fonksiyonumuz

function CreateUserPage() {
  const [formData, setFormData] = useState({
    kullanici_adi: '',
    password: '',
    rol: '',
    lokasyon_id: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // lokasyon_id'nin sayı olduğundan emin olalım
    const submissionData = {
      ...formData,
      lokasyon_id: parseInt(formData.lokasyon_id, 10)
    };

    try {
      const response = await createUser(submissionData);
      setSuccess(`Kullanıcı "${response.data.kullanici_adi}" başarıyla oluşturuldu!`);
      // Formu temizle
      setFormData({ kullanici_adi: '', password: '', rol: '', lokasyon_id: '' });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Kullanıcı oluşturulurken bir hata oluştu.';
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Yeni Kullanıcı Oluştur
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="kullanici_adi"
              label="Kullanıcı Adı"
              value={formData.kullanici_adi}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Şifre"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="rol-select-label">Rol</InputLabel>
              <Select
                labelId="rol-select-label"
                id="rol-select"
                name="rol"
                value={formData.rol}
                label="Rol"
                onChange={handleChange}
              >
                <MenuItem value={"YONETICI"}>Yönetici</MenuItem>
                <MenuItem value={"KASIYER"}>Kasiyer</MenuItem>
                <MenuItem value={"MUSTERI"}>Müşteri</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lokasyon_id"
              label="Lokasyon ID"
              type="number"
              value={formData.lokasyon_id}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Kullanıcıyı Oluştur
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Box>
    </Container>
  );
}

export default CreateUserPage;