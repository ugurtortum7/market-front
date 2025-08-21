// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import CreateUserPage from './pages/CreateUserPage';
import ProductsPage from './pages/ProductsPage';
import StockPage from './pages/StockPage';
import CategoryPage from './pages/CategoryPage';
import AdminRoute from './components/AdminRoute'; // Bunu şimdilik tutalım, başka yerlerde gerekebilir

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>} >
        <Route index element={<HomePage />} />
        <Route path="urunler" element={<ProductsPage />} />
        <Route path="stoklar" element={<StockPage />} />
        {/* Yöneticiye özel rotalar */}
        <Route path="kategoriler" element={<AdminRoute><CategoryPage /></AdminRoute>} />
        <Route path="yeni-kullanici" element={<AdminRoute><CreateUserPage /></AdminRoute>} />
      </Route>
    </Routes>
  );
}
export default App;