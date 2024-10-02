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
  console.log('Token retrieved:', token);

  const { pathname } = useLocation();
  const logout = useLogout();
  const [walletState, setWalletState] = useAtom(walletStateAtom);
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  console.log('Current wallet state:', walletState);

  // Handle inactivity logout
  useEffect(() => {
    const handleActivity = () => {
      console.log('User activity detected, updating last activity time.');
      setLastActivityTime(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivityTime;
      console.log('Checking for inactivity. Time since last activity:', timeSinceLastActivity);
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        console.log('User inactive for too long, logging out.');
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
    console.log('Fetching wallet address from token...');
    const accessToken = getStoredAccessToken();
    const walletAddress = accessToken?.walletAddress;
    console.log('Access token:', accessToken);
    console.log('Wallet address from token:', walletAddress);

    if (walletAddress && walletState.address === '') {
      // Set wallet address in the global state (atom)
      console.log('Setting wallet address and assets in state:', walletAddress);
      // Fetch wallet assets and update the state
      fetchWalletAssets({ address: walletAddress, assets: [] })
        .then(assets => {
          console.log('Fetched wallet assets:', assets);
          setWalletState({
            address: walletAddress,
            assets,
          });
        })
        .catch(error => {
          console.error('Error fetching wallet assets:', error);
          setWalletState(prevState => ({
            ...prevState,
            address: walletAddress,
            assets: [],
          }));
        });
    } else {
      console.log('No wallet address found, skipping asset fetch.');
    }
  }, [walletState]);

  // Periodically refetch wallet assets every DATA_FRESHNESS_TIMEOUT interval
  useEffect(() => {
    if (timer) {
      console.log('Clearing previous timer.');
      clearInterval(timer);
    }

    console.log('Setting new timer to refetch wallet assets every', DATA_FRESHNESS_TIMEOUT, 'ms');
    const expirationTimer = setInterval(() => {
      // NOTE: this is mentioned before walletState falls out.  multiple timers?
      console.log('Fetching wallet assets on interval for', walletState);
      fetchWalletAssets(walletState)
        .then(assets => {
          console.log('Assets fetched on interval:', assets);
          setWalletState(prevState => ({
            ...prevState,
            assets,
          }));
        })
        .catch(error => {
          console.error('Error refetching wallet assets:', error);
        });
    }, DATA_FRESHNESS_TIMEOUT);

    setTimer(expirationTimer);

    return () => {
      if (timer) {
        console.log('Clearing timer on component unmount.');
        clearInterval(timer);
      }
    };
  }, [walletState, setWalletState]);

  if (!token) {
    console.log('No token found, redirecting to login.');
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to={ROUTES.AUTH.ROOT} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    const redirectLocation = requestedLocation;
    console.log('Redirecting to requested location:', redirectLocation);
    setRequestedLocation(null);
    return <Navigate to={redirectLocation} />;
  }

  return <>{children}</>;
};
