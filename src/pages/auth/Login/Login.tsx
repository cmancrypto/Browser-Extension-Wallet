import React from 'react';
import { NavLink } from 'react-router-dom';

import { EyeOpen } from '@/assets/icons';
import { ROUTES } from '@/constants';
import { Button, Input } from '@/ui-kit';

export const Login: React.FC = () => (
  <div className="mt-6 h-full">
    <div className="w-full h-full pt-7 px-8 flex flex-col">
      <h1 className="text-white text-h2 font-bold">Welcome back!</h1>
      <p className="mt-2.5 text-neutral-1 text-base">Sign in to securely access your wallet</p>
      <form className="mt-9 flex-1">
        <Input
          variant="primary"
          className="w-full"
          wrapperClass="mb-4"
          label="Password"
          placeholder="Enter password"
          icon={<EyeOpen width={20} />}
          iconRole="button"
        />
        <div className="w-full flex">
          <Button variant="link" size="xsmall" className="text-sm" asChild>
            <NavLink to={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot password?</NavLink>
          </Button>
        </div>
      </form>
      <div className="flex flex-col gap-y-4 w-full justify-between gap-x-5 pb-2">
        <Button className="w-full">Unlock</Button>
        <div>
          <span className="text-base text-white mr-1">Don&apos;t have a wallet yet?</span>
          <Button variant="link" size="xsmall" className="text-base" asChild>
            <NavLink to={ROUTES.AUTH.NEW_WALLET.ROOT}>Create wallet</NavLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
