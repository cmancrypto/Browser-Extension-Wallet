import React from 'react';
import { NavLink } from 'react-router-dom';

import { LogoWhite } from '@/assets/icons/LogoWhite/LogoWhite';
import { ROUTES } from '@/constants';
import { Button } from '@/ui-kit';

export const NewWallet: React.FC = () => (
  <div className="max-w-[300px] mx-auto mt-6 flex items-center flex-col text-white">
    <h1 className=" text-h1 font-bold text-center">Welcome to Symphony wallet</h1>
    <div className="py-5">
      <LogoWhite className="w-[165px]" />
    </div>
    <div className="w-full flex flex-col items-center mb-2">
      <Button className="w-full" asChild>
        <NavLink to={ROUTES.AUTH.CREATE_WALLET}>Create wallet</NavLink>
      </Button>
      <span className="mt-1.5 mb-2.5 text-lg">or</span>
      <Button className="w-full" variant="secondary" asChild>
        <NavLink to={ROUTES.APP.ROOT}>Import existing</NavLink>
      </Button>
    </div>
  </div>
);
