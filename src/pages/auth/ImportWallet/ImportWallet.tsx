import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { RecoveryPhraseGrid } from '@/components';
import { ROUTES } from '@/constants';
import { Button } from '@/ui-kit';

export const ImportWallet: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);

  const handleResult = (allVerified: boolean) => {
    setIsVerified(allVerified);
  };

  return (
    <div className="pt-6 text-white h-full flex flex-col">
      <h1 className="text-h3 font-semibold">Import wallet</h1>
      <p className="mt-2.5 text-neutral-1 text-base">Write your recovery phrase</p>
      <div className="mt-10 flex-1">
        <RecoveryPhraseGrid handleResult={handleResult} />
      </div>
      <div className="flex w-full px-10 justify-between gap-x-5 pb-2">
        <Button variant="secondary" className="w-full" asChild>
          <NavLink to={ROUTES.AUTH.ROOT}>Back</NavLink>
        </Button>
        <Button className="w-full" disabled={!isVerified}>
          Next
        </Button>
      </div>
    </div>
  );
};
