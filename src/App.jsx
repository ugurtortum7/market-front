// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // Layout bileşenini import ediyoruz
import CreateUserPage from './pages/CreateUserPage';
import ProductsPage from './pages/ProductsPage';
import StockPage from './pages/StockPage';

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
        <Route path="urunler" element={<ProductsPage />} />
        <Route path="stoklar" element={<StockPage />} />
      </Route>
    </Routes>
  );
}

export default App;