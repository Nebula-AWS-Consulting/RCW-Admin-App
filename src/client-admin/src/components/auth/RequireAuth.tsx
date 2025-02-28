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

  if (!auth.token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return children;
};
