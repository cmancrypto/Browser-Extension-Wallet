import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { EyeOpen, EyeClose } from '@/assets/icons';
import { ROUTES } from '@/constants';
import { Button, Input } from '@/ui-kit';
import { tryAuthorizeWalletAccess } from '@/helpers';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<'error' | 'success' | null>(null);
  const navigate = useNavigate();

  // Reset status on typing
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordStatus(null);
  };

  const handleUnlock = async () => {
    const isAuthorized = await tryAuthorizeWalletAccess(password);
    if (isAuthorized) {
      // If password is correct, navigate to app root
      console.log('correct password.  navigating to app root');
      navigate(ROUTES.APP.ROOT);
    } else {
      // If password is incorrect, set status to error
      setPasswordStatus('error');
    }
  };

  return (
    <div className="mt-6 h-full">
      <div className="w-full h-full pt-7 px-8 flex flex-col">
        <h1 className="text-white text-h2 font-bold">Welcome back!</h1>
        <p className="mt-2.5 text-neutral-1 text-base">Sign in to securely access your wallet</p>
        <form className="mt-9 flex-1">
          <Input
            variant="primary"
            status={passwordStatus}
            errorText={passwordStatus === 'error' ? 'Incorrect password' : ''}
            className="w-full"
            wrapperClass="mb-4"
            label="Password"
            placeholder="Enter password"
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            icon={passwordVisible ? <EyeOpen width={20} /> : <EyeClose width={20} />}
            iconRole="button"
            onIconClick={() => setPasswordVisible(!passwordVisible)}
          />
          <div className="w-full flex">
            <Button variant="link" size="xsmall" className="text-sm" asChild>
              <NavLink to={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot password?</NavLink>
            </Button>
          </div>
        </form>
        <div className="flex flex-col gap-y-4 w-full justify-between gap-x-5 pb-2">
          <Button className="w-full text-black" onClick={handleUnlock}>
            Unlock
          </Button>
          <div>
            <span className="text-base text-white mr-1">Don't have a wallet yet?</span>
            <Button variant="link" size="xsmall" className="text-base" asChild>
              <NavLink to={ROUTES.AUTH.NEW_WALLET.ROOT}>Create wallet</NavLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
