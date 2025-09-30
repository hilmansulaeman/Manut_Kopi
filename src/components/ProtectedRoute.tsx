import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/login' }) => {
  const { isLoggedIn } = useProfile();

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
