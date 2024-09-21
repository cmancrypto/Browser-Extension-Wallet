import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { EyeOpen, EyeClose, VerifySuccess } from '@/assets/icons';
import { RecoveryPhraseGrid } from '@/components';
import { ROUTES } from '@/constants';
import { Button, Input, Stepper } from '@/ui-kit';

const STEPS_LABELS = ['Create password', 'Recovery phrase', 'Verify phrase'];

export const CreateWallet = () => {
  const [active, setActive] = useState(0);
  const [mnemonic12, setMnemonic12] = useState<string>('');
  const [mnemonic24, setMnemonic24] = useState<string>('');
  const [use24Words, setUse24Words] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Select random hidden indexes for verification step
  const getRandomIndexes = () => {
    const phraseLength = use24Words ? 24 : 12;
    const indexes = Array.from(Array(phraseLength).keys());
    const shuffled = indexes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const [randomHiddenIndexes, setRandomHiddenIndexes] = useState(getRandomIndexes());

  // Separate states for each password's visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Generate the mnemonic phrases on component mount
  useEffect(() => {
    const generateMnemonics = async () => {
      const wallet12 = await Secp256k1HdWallet.generate(12);
      const wallet24 = await Secp256k1HdWallet.generate(24);
      setMnemonic12(wallet12.mnemonic);
      setMnemonic24(wallet24.mnemonic);
    };

    generateMnemonics();
  }, []);

  useEffect(() => {
    if (active !== 2) {
      setIsVerified(false);
      // Reset verification words on change of screen
      setRandomHiddenIndexes(getRandomIndexes());
    }
  }, [active]);

  // Proceed to next step
  const nextStep = () => setActive(current => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));

  // Copy recovery phrase to clipboard
  const handleCopyToClipboard = () => {
    const phraseToCopy = use24Words ? mnemonic24 : mnemonic12;
    navigator.clipboard.writeText(phraseToCopy);
  };

  // No need to reset randomHiddenIndexes after verification
  const handleResult = (allVerified: boolean) => {
    setIsVerified(allVerified);
  };

  // Regenerate random indexes when use24Words is toggled
  useEffect(() => {
    setRandomHiddenIndexes(getRandomIndexes());
  }, [use24Words]);

  return (
    <div className="mt-6 h-full">
      <Stepper
        active={active}
        labels={STEPS_LABELS}
        progressBarClass="px-9"
        containerClass="h-full"
      >
        {/* Step 1: Create password */}
        <div className="w-full h-full pt-7 px-8 flex flex-col">
          <h1 className="text-white text-h3 font-semibold">{STEPS_LABELS[0]}</h1>
          <form className="mt-9 flex-1">
            {/* New Password Input */}
            <Input
              variant="primary"
              className="w-full"
              wrapperClass="mb-4"
              label="New password (8 characters min)"
              placeholder="Enter password"
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={passwordVisible ? <EyeClose width={20} /> : <EyeOpen width={20} />}
              iconRole="button"
              onIconClick={() => setPasswordVisible(!passwordVisible)}
            />
            {/* Confirm Password Input */}
            <Input
              variant="primary"
              className="w-full"
              label="Confirm password"
              placeholder="Repeat password"
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              icon={confirmPasswordVisible ? <EyeClose width={20} /> : <EyeOpen width={20} />}
              iconRole="button"
              onIconClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            />
          </form>
          <div className="flex w-full justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" asChild>
              <NavLink to={ROUTES.AUTH.NEW_WALLET.ROOT}>Back</NavLink>
            </Button>
            <Button className="w-full" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>

        {/* Step 2: Display recovery phrase */}
        <div className="w-full h-full pt-7 flex flex-col">
          <h1 className="text-white text-h3 font-semibold">{STEPS_LABELS[1]}</h1>
          <p className="mt-2.5 text-base text-neutral-1">Backup your secret recovery phrase</p>

          {/* 12 Words vs 24 Words selection */}
          <div className="flex justify-center mt-5">
            <Button
              variant={!use24Words ? 'selected' : 'unselected'}
              onClick={() => setUse24Words(false)}
              className="ml-4"
            >
              12 Words
            </Button>
            <Button
              variant={use24Words ? 'selected' : 'unselected'}
              onClick={() => setUse24Words(true)}
            >
              24 Words
            </Button>
          </div>

          <div className="mt-3 flex-1">
            <RecoveryPhraseGrid
              phrase={(use24Words ? mnemonic24 : mnemonic12).split(' ').map((word, index) => ({
                id: index,
                value: word,
              }))}
              withButtons
            />
          </div>
          <div className="flex w-full px-10 justify-between gap-x-5 pb-2 mt-4">
            <Button variant="secondary" className="w-full" onClick={prevStep}>
              Back
            </Button>
            <Button className="w-full" onClick={handleCopyToClipboard}>
              Copy {use24Words ? '24' : '12'}-Word Phrase
            </Button>
            <Button className="w-full" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>

        {/* Step 3: Verify recovery phrase */}
        <div className="w-full h-full pt-7 flex flex-col">
          <h1 className="text-white text-h3 font-semibold">{STEPS_LABELS[2]}</h1>
          <p className="mt-2.5 text-neutral-1 text-base">Confirm your secret recovery phrase</p>
          <div className="mt-9 flex-1">
            <RecoveryPhraseGrid
              phrase={(use24Words ? mnemonic24 : mnemonic12).split(' ').map((word, index) => ({
                id: index,
                value: word,
              }))}
              withButtons
              isVerifyMode={true}
              hiddenIndexes={randomHiddenIndexes}
              handleResult={handleResult}
            />
          </div>
          <div className="flex w-full px-10 justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" onClick={prevStep}>
              Back
            </Button>
            <Button className="w-full" onClick={nextStep} disabled={!isVerified}>
              Next
            </Button>
          </div>
        </div>

        {/* Final step: Wallet creation success */}
        <div className="w-full h-full pt-3 flex flex-col px-16" data-hidden="true">
          <div className="px-10 pb-2">
            <VerifySuccess width="100%" />
          </div>
          <h1 className="text-white text-h3 font-semibold">Congratulations!</h1>
          <p className="mt-2.5 text-neutral-1 text-base">Your wallet is created successfully</p>
          <Button className="mt-8" asChild>
            <NavLink to={ROUTES.AUTH.ROOT}>Got it</NavLink>
          </Button>
        </div>
      </Stepper>
    </div>
  );
};
