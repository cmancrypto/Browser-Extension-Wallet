import { useEffect, useRef } from 'react';
import { useLogout } from './useLogout';
import { INACTIVITY_TIMEOUT } from '@/constants';

/**
 * Custom hook to handle user inactivity and automatic logout.
 */
export const useInactivityCheck = () => {
  const lastActivityTimeRef = useRef(Date.now());
  const logout = useLogout();

  useEffect(() => {
    // Log the inactivity timeout value to ensure it's correctly set
    console.log(`INACTIVITY_TIMEOUT: ${INACTIVITY_TIMEOUT}`);

    const handleActivity = () => {
      console.log('Activity detected, resetting last activity time.');
      lastActivityTimeRef.current = Date.now();
      console.log('Last activity time updated to:', lastActivityTimeRef.current);
    };

    const checkInactivity = () => {
      console.log('Current time:', Date.now());
      console.log('Last activity time:', lastActivityTimeRef.current);
      const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
      console.log(`Time since last activity: ${timeSinceLastActivity} ms`);

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.log('Inactivity timeout reached, logging out.');
        logout();
      } else {
        console.log(
          `Still within timeout, no action taken. Timeout threshold: ${INACTIVITY_TIMEOUT} ms`,
        );
      }
    };

    // Add event listeners to track user activity
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    // Set an interval to check for inactivity
    const inactivityInterval = setInterval(() => {
      console.log('Checking inactivity...');
      checkInactivity();
    }, 5 * 1000);

    console.log('Inactivity check started.');

    return () => {
      clearInterval(inactivityInterval);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      console.log('Inactivity check cleanup.');
    };
  }, [logout]);
};
