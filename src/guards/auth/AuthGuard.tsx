import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { getAccessToken } from '@/helpers/auth';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const token = getAccessToken();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!token) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    return <Navigate to={ROUTES.AUTH.ROOT} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);

    return <Navigate to={requestedLocation} />;
  }

  return children;
};
