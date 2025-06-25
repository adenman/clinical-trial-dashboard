import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.DEV ? '/' : '/ClinicalTrial/'}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // Show a global loading indicator while checking auth status
  if (loading && !user) { 
      return <div className="flex h-screen w-full items-center justify-center">Authenticating...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/*" element={user ? <AppLayout /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;