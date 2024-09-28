import { useNavigate } from 'react-router-dom';
import { removeStoredAccessToken } from '@/helpers';
import { ROUTES } from '@/constants';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear sensitive data if necessary
    removeStoredAccessToken();

    // Use React Router's navigate instead of window.location.href
    navigate(ROUTES.AUTH.ROOT);
  };

  return logout;
};
