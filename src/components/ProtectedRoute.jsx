import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If there's no user, redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the child components (i.e., the AppLayout).
  return <Outlet />;
};

export default ProtectedRoute;
