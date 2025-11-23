import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('ProtectedRoute check:', { isAuthenticated, userRole: user?.role, requiredRole: role, loading });

  if (loading) {
    console.log('Still loading user data...');
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    console.log(`Role mismatch: user is ${user?.role}, required ${role}`);
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'customer') return <Navigate to="/dashboard" replace />;
    if (user?.role === 'worker') return <Navigate to="/worker/dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  console.log('Access granted, rendering protected content');
  return children;
};

export default ProtectedRoute;
