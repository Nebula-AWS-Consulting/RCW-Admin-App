// src/components/RequireAuth.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (auth.token) {
    return children;
  }

  const persistedAuthStr = localStorage.getItem('authState');
  if (persistedAuthStr) {
    try {
      const persistedAuth = JSON.parse(persistedAuthStr);
      if (persistedAuth && persistedAuth.token) {
        return children;
      }
    } catch (e) {
      console.error('Failed to parse persisted auth state:', e);
    }
  }

  return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
};
