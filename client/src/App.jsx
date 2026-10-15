import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Catalog } from './pages/Catalog';
import { Watch } from './pages/Watch';
import { Subscribe } from './pages/Subscribe';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

// Garde de route Administrateur
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/catalog" replace />;
};

export const App = () => {
  return (
    <div className="min-h-screen bg-cinema-950 text-neutral-100 flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/catalog" replace />} />
          </Routes>
        </main>
      </div>

      <footer className="border-t border-cinema-800 bg-cinema-950 py-8 text-center text-xs text-neutral-500 font-mono">
        <p>© 2026 صَنْعة (SANAA) — جميع الحقوق محفوظة لاستوديو عبد الإله بحيحي.</p>
        <p className="mt-1 text-[11px] text-neutral-600">
          منصة تعليمية وبث فيديو مشفر بنظام DRM وحماية العلامة المائية الفورية.
        </p>
      </footer>
    </div>
  );
};

export default App;
