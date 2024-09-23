import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { getStoredAccessToken } from '@/helpers';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const token = getStoredAccessToken();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  // If no token (not authenticated), save the requested location (if not saved)
  if (!token) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to={ROUTES.AUTH.ROOT} />;
  }

  // Once the user is authenticated, if there was a requested location, navigate to it
  if (requestedLocation && pathname !== requestedLocation) {
    const redirectLocation = requestedLocation;
    setRequestedLocation(null);
    return <Navigate to={redirectLocation} />;
  }

  return <>{children}</>;
};
