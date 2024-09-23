import React from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { getStoredAccessToken } from '@/helpers';

interface GuestGuardProps {
  children?: React.ReactNode;
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const token = getStoredAccessToken();
  console.log(token);
  if (token) {
    return <Navigate to={ROUTES.APP.ROOT} />;
  }

  return children;
};
