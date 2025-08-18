// src/services/authService.js

// LÜTFEN BU ADRESİ KENDİ RAILWAY BACKEND ADRESİNİZLE DEĞİŞTİRİN!
const API_URL = "https://web-production-f05f2.up.railway.app";

console.log("Backend'e istek gönderiliyor:", `${API_URL}/auth/login`);

export const login = async (username, password) => {
  // FastAPI'nin OAuth2PasswordRequestForm'u 'x-www-form-urlencoded' formatında veri bekler.
  // Bu veriyi oluşturmak için URLSearchParams kullanıyoruz.
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  // fetch API'si ile backend'e POST isteği gönderiyoruz.
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  // Backend'den dönen cevabı JSON formatına çeviriyoruz.
  const data = await response.json();

  // Eğer response'un durumu "başarılı" değilse (örn: 401 Unauthorized hatası),
  // bir hata fırlatıyoruz. Bu hatayı LoginPage'de yakalayacağız.
  if (!response.ok) {
    throw new Error(data.detail || 'Giriş işlemi sırasında bir hata oluştu.');
  }

  // Her şey yolundaysa, backend'den gelen token verisini döndürüyoruz.
  return data;
};