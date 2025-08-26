// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import CreateUserPage from './pages/CreateUserPage';
import ProductsPage from './pages/ProductsPage';
import StockPage from './pages/StockPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    // Toaster ve Routes'u yan yana kullanabilmek için bir React Fragment (<>...</>) içine alıyoruz.
    <>
      {/* Bu bileşen, projenin herhangi bir yerinden çağrılan toast'ları ekranda gösterir */}
      <Toaster
        position="top-right" // Bildirimlerin ekranın sağ üst köşesinde çıkmasını sağlar
        reverseOrder={false}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>} >
          {/* Herkesin görebileceği sayfalar */}
          <Route index element={<HomePage />} />
          <Route path="urunler" element={<ProductsPage />} />
          <Route path="sepet" element={<CartPage />} />
          <Route path="siparislerim" element={<OrdersPage />} />
          <Route path="favorilerim" element={<FavoritesPage />} />

          {/* Yönetici ve Kasiyerin görebileceği sayfalar */}
          <Route path="stoklar" element={<StockPage />} />
          
          {/* Sadece Yöneticinin görebileceği sayfalar */}
          <Route path="kategoriler" element={<AdminRoute><CategoryPage /></AdminRoute>} />
          <Route path="yeni-kullanici" element={<AdminRoute><CreateUserPage /></AdminRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;