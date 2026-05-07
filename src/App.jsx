import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(true); // Small delay to avoid flicker
      setTimeout(() => setLoading(false), 500);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-merengue-main animate-pulse text-2xl">Cargando...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
