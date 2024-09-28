import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { INACTIVITY_TIMEOUT, DATA_FRESHNESS_TIMEOUT, ROUTES } from '@/constants';
import { fetchWalletAssets, getStoredAccessToken } from '@/helpers';
import { useLogout } from '@/hooks';
import { walletStateAtom } from '@/atoms';
import { useAtom } from 'jotai';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const token = getStoredAccessToken();
  const { pathname } = useLocation();
  const logout = useLogout();
  const [walletState, setWalletState] = useAtom(walletStateAtom);
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

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

    const inactivityInterval = setInterval(checkInactivity, 60 * 1000);

    return () => {
      clearInterval(inactivityInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [lastActivityTime]);

  // Fetch wallet address from stored token and update global state
  useEffect(() => {
    const accessToken = getStoredAccessToken();
    const walletAddress = accessToken?.walletAddress;

    if (walletAddress) {
      // Set wallet address in the global state (atom)
      setWalletState(prevState => ({
        ...prevState,
        address: walletAddress,
        assets: [],
      }));

      // Fetch wallet assets and update the state
      fetchWalletAssets({ address: walletAddress, assets: [] })
        .then(assets => {
          setWalletState(prevState => ({
            ...prevState,
            assets,
          }));
        })
        .catch(error => {
          console.error('Error fetching wallet assets:', error);
        });
    }
  }, [setWalletState]);

  // Periodically refetch wallet assets every DATA_FRESHNESS_TIMEOUT interval
  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }

    const expirationTimer = setInterval(() => {
      fetchWalletAssets(walletState)
        .then(assets => {
          setWalletState(prevState => ({
            ...prevState,
            assets,
          }));
        })
        .catch(error => {
          // TODO: display error to user
          console.error('Error refetching wallet assets:', error);
        });
    }, DATA_FRESHNESS_TIMEOUT);

    setTimer(expirationTimer);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [walletState, setWalletState]);

  if (!token) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to={ROUTES.AUTH.ROOT} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    const redirectLocation = requestedLocation;
    setRequestedLocation(null);
    return <Navigate to={redirectLocation} />;
  }

  return <>{children}</>;
};
