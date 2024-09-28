import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { INACTIVITY_TIMEOUT, ROUTES } from '@/constants';
import { getStoredAccessToken } from '@/helpers';
import { useLogout } from '@/hooks';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  // TODO: look into this saved navigation callback
  // TODO: check if wallet exists as well as if there's an access token
  const token = getStoredAccessToken();
  const { pathname } = useLocation();
  const logout = useLogout();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  // Handle inactivity logout
  useEffect(() => {
    const handleActivity = () => setLastActivityTime(Date.now());

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    const checkInactivity = () => {
      if (Date.now() - lastActivityTime > INACTIVITY_TIMEOUT) {
        logout();
      }
    };

    const inactivityInterval = setInterval(checkInactivity, 60 * 1000); // Check every minute

    return () => {
      clearInterval(inactivityInterval);
      // TODO: verify these only trigger inside extension
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [lastActivityTime]);

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
