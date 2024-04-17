import React from 'react';
import { NavLink } from 'react-router-dom';

import { RecoveryPhraseGrid } from '@/components';
import { ROUTES } from '@/constants';
import { Button } from '@/ui-kit';

const EXAMPLE_PHRASE = [
  { id: 1, value: 'gasp' },
  { id: 2, value: 'focus' },
  { id: 3, value: 'large' },
  { id: 4, value: 'fruit' },
  { id: 5, value: 'mountain' },
  { id: 6, value: 'spider' },
  { id: 7, value: 'ball' },
  { id: 8, value: 'flag' },
  { id: 9, value: 'visual' },
  { id: 10, value: 'game' },
  { id: 11, value: 'sheriff' },
  { id: 12, value: 'strategy' },
];

export const ImportWallet: React.FC = () => (
  <div className="pt-6 text-white h-full flex flex-col">
    <h1 className="text-h1 font-semibold">Import wallet</h1>
    <p className="mt-1.5 text-neutral-1 leading-7">Write your recovery phrase</p>
    <div className="mt-10 flex-1">
      <RecoveryPhraseGrid phrase={EXAMPLE_PHRASE} />
    </div>
    <div className="flex w-full px-10 justify-between gap-x-5 pb-2">
      <Button variant="secondary" className="w-full" asChild>
        <NavLink to={ROUTES.AUTH.ROOT}>Back</NavLink>
      </Button>
      <Button className="w-full">Next</Button>
    </div>
  </div>
);
