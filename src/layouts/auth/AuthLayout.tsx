import React, { ComponentType } from 'react';
import { Outlet } from 'react-router-dom';

import { Logo } from '@/assets/icons';

const AuthLayout: React.FC = () => (
  <div className="max-w-full bg-background-black h-full p-5 flex flex-col">
    <header className="py-4 flex justify-center items-center">
      <Logo className="h-11" />
    </header>
    <Outlet />
  </div>
);

export default AuthLayout as ComponentType;
