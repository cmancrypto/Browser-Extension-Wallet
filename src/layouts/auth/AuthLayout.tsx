import React, { ComponentType } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Logo } from '@/assets/icons';
import { ROUTES } from '@/constants';
import { storeAccessToken } from '@/helpers';

const EXAMPLE_TOKEN = 'token';

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();

  const onLogoClick = () => {
    // TODO: remove
    storeAccessToken(EXAMPLE_TOKEN);

    navigate(ROUTES.APP.ROOT);
  };
  return (
    <div className="max-w-full bg-background-black h-full p-5 flex flex-col">
      <header className="py-2 flex justify-center items-center">
        <Logo className="h-9" role="button" onClick={onLogoClick} />
      </header>
      <Outlet />
    </div>
  );
};

export default AuthLayout as ComponentType;
