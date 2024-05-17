import { NavLink } from 'react-router-dom';

import { EyeOpen } from '@/assets/icons';
import { RecoveryPhraseGrid } from '@/components';
import { ROUTES } from '@/constants';
import { Button, Input } from '@/ui-kit';

export const ForgotPassword = () => (
  <div className="mt-6 h-full">
    <div>
      <h1 className="text-white text-h2 font-bold">Reset wallet</h1>
      <p className="mt-2.5 text-neutral-1 text-base/5 max-w-[310px] mx-auto">
        Restore access to your wallet securely and enter the secret phrase
      </p>
      <div className="mt-5 flex-1">
        <RecoveryPhraseGrid />
      </div>
      <form className="mt-5 flex-1">
        <Input
          variant="primary"
          className="w-full"
          wrapperClass="mb-4"
          label="New password (8 characters min)"
          placeholder="Enter password"
          icon={<EyeOpen width={20} />}
          iconRole="button"
        />
        <Input
          variant="primary"
          className="w-full"
          label="Confirm password"
          placeholder="Repeat password"
          icon={<EyeOpen width={20} />}
          iconRole="button"
        />
      </form>
      <div className="mt-5 flex-1 flex w-full justify-between gap-x-5">
        <Button variant="secondary" className="w-full" asChild>
          <NavLink to={ROUTES.AUTH.ROOT}>Back</NavLink>
        </Button>
        <Button className="w-full" asChild>
          <NavLink to={ROUTES.AUTH.FORGOT_PASSWORD}>Restore</NavLink>
        </Button>
      </div>
    </div>
  </div>
);
