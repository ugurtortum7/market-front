// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // Layout bileşenini import ediyoruz
import CreateUserPage from './pages/CreateUserPage';

function App() {
  return (
    <Routes>
      {/* Login rotası hala tek başına ve herkese açık */}
      <Route path="/login" element={<LoginPage />} />

      {/* Şimdi korumalı olan ana rotamız, Layout bileşenini render ediyor. */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Layout'un içindeki <Outlet />'e render edilecek alt rotalar burada tanımlanır. */}
        {/* 'index' rotası, üst path ('/') ile aynı olduğunda hangi bileşenin gösterileceğini belirtir. */}
        <Route index element={<HomePage />} />
        <Route path="yeni-kullanici" element={<CreateUserPage />} />

        {/* Gelecekte yeni sayfalar eklemek isterseniz, buraya ekleyeceksiniz. Örnek:
        <Route path="urunler" element={<UrunlerSayfasi />} />
        Bu rota /urunler adresinde çalışacak ve Layout'un içinde görünecektir.
        */}
      </Route>
    </Routes>
  );
}

export default App;