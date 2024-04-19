import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { RecoveryPhraseGrid } from '@/components';
import { EMPTY_RECOVERY_PHRASE, ROUTES } from '@/constants';
import { Button } from '@/ui-kit';

export const ImportWallet: React.FC = () => {
  const [phraseResult, setPhraseResult] = useState(EMPTY_RECOVERY_PHRASE);

  const handleResult = (index: number, value: string) => {
    const result = [...phraseResult];

    result[index].value = value;

    setPhraseResult(result);
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
        <Button className="w-full">Next</Button>
      </div>
    </div>
  );
};
