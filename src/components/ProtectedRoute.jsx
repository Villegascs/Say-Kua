import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, redirect based on role or to home
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'chef') return <Navigate to="/chef" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
