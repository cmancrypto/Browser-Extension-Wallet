import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { EyeOpen, VerifySuccess } from '@/assets/icons';
import { RecoveryPhraseGrid } from '@/components';
import { ROUTES } from '@/constants';
import { Button, Input, Stepper } from '@/ui-kit';

const STEPS_LABELS = ['Create password', 'Recovery phrase', 'Verify phrase'];
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

export const CreateWallet = () => {
  const [active, setActive] = useState(0);
  console.log('active', active);
  const nextStep = () => setActive(current => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));

  return (
    <div className="mt-6 h-full">
      <Stepper
        active={active}
        labels={STEPS_LABELS}
        progressBarClass="px-9"
        containerClass="h-full"
      >
        <div className="w-full h-full pt-6 px-8 flex flex-col">
          <h1 className="text-white text-h1 font-semibold">{STEPS_LABELS[0]}</h1>
          <form className="mt-5 flex-1">
            <Input
              variant="primary"
              className="w-full"
              wrapperClass="mb-4"
              label="New password (8 characters min)"
              placeholder="Enter password"
              icon={<EyeOpen />}
            />
            <Input
              variant="primary"
              className="w-full"
              label="Confirm password"
              placeholder="Repeate password"
              icon={<EyeOpen />}
            />
          </form>
          <div className="flex w-full justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" asChild>
              <NavLink to={ROUTES.AUTH.ROOT}>Back</NavLink>
            </Button>
            <Button className="w-full" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
        <div className="w-full h-full pt-6 flex flex-col">
          <h1 className="text-white text-h1 font-semibold">{STEPS_LABELS[1]}</h1>
          <p className="mt-1.5 text-neutral-1 leading-7">Backup your secret recovery phrase</p>
          <div className="mt-5 flex-1">
            <RecoveryPhraseGrid phrase={EXAMPLE_PHRASE} withButtons />
          </div>
          <div className="flex w-full px-10 justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" onClick={prevStep}>
              Back
            </Button>
            <Button className="w-full" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
        <div className="w-full h-full pt-6 flex flex-col">
          <h1 className="text-white text-h1 font-semibold">{STEPS_LABELS[2]}</h1>
          <p className="mt-1.5 text-neutral-1 leading-7">Confirm your secret recovery phrase</p>
          <div className="mt-5 flex-1">
            <RecoveryPhraseGrid phrase={EXAMPLE_PHRASE} verifyPhrase />
          </div>
          <div className="flex w-full px-10 justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" onClick={prevStep}>
              Back
            </Button>
            <Button className="w-full" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
        <div className="w-full h-full pt-3 flex flex-col px-16" data-hidden="true">
          <div className="px-10 pb-2">
            <VerifySuccess width="100%" />
          </div>
          <h1 className="text-white text-h1 font-semibold">Congratulations!</h1>
          <p className="mt-1.5 text-neutral-1 leading-7">Your wallet is created succesfully</p>
          <Button className="mt-8" asChild>
            <NavLink to={ROUTES.AUTH.ROOT}>Got it</NavLink>
          </Button>
        </div>
      </Stepper>
    </div>
  );
};
