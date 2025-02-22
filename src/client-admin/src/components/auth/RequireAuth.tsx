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

  // Check if the user is logged in (e.g., if token exists)
  if (!auth.token) {
    // Redirect them to the sign-in page and preserve the current location
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child components
  return children;
};
