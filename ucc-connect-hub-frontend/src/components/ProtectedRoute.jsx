// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('🛡️ ProtectedRoute - loading:', loading);
  console.log('🛡️ ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🛡️ ProtectedRoute - user:', user);
  console.log('🛡️ ProtectedRoute - allowedRoles:', allowedRoles);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🛡️ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('🛡️ Role not authorized, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🛡️ Access granted');
  return children;
};

export default ProtectedRoute;