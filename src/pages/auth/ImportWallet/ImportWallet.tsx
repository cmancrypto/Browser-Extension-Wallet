import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { EyeOpen, EyeClose } from '@/assets/icons';
import { RecoveryPhraseGrid, WalletSuccessScreen } from '@/components';
import { ROUTES } from '@/constants';
import { Button, Input, Stepper } from '@/ui-kit';
import { createWallet, generateToken } from '@/helpers/wallet';
import { useAtom } from 'jotai';
import { mnemonic12State, mnemonic24State, mnemonicVerifiedState, use24WordsState } from '@/atoms';

const STEPS_LABELS = ['Enter Passphrase', 'Create password'];

export const ImportWallet = () => {
  const [mnemonic12, setMnemonic12] = useAtom(mnemonic12State);
  const [mnemonic24, setMnemonic24] = useAtom(mnemonic24State);
  const [use24Words, setUse24Words] = useAtom(use24WordsState);
  const [mnemonicVerified, setMnemonicVerified] = useAtom(mnemonicVerifiedState);

  const [active, setActive] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<'error' | 'success' | null>(null);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<'error' | 'success' | null>(
    null,
  );
  const [passwordsAreVerified, setPasswordsAreVerified] = useState(false);
  const [fullyVerified, setFullyVerified] = useState(false);

  // Proceed to next step
  const nextStep = () => setActive(current => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));

  useEffect(() => {
    clearState();
  }, []);

  useEffect(() => {
    console.log('mnemonicVerified:', mnemonicVerified);
    console.log('passwordsAreVerified:', passwordsAreVerified);

    // Ensure both passwords and mnemonic are fully validated before enabling the next button
    setFullyVerified(passwordsAreVerified && mnemonicVerified);
  }, [passwordsAreVerified, mnemonicVerified]);

  const clearState = () => {
    setMnemonic12(new Array(12).fill(''));
    setMnemonic24(new Array(24).fill(''));
    setUse24Words(false);
    setMnemonicVerified(false);
  };

  const getCurrentMnemonic = () => (use24Words ? mnemonic24 : mnemonic12);
  const getStringMnemonic = () => getCurrentMnemonic().join(' ');

  // Check everything is completed properly and pass to confirmation screen
  const handleCreateWallet = async () => {
    try {
      // Generate wallet from the mnemonic and create the token
      const { walletAddress } = await createWallet(getStringMnemonic(), password);
      generateToken(walletAddress);

      // Clear state and navigate to confirmation page after wallet creation
      clearState();
      nextStep();
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const validatePassword = () => {
    const isPasswordValid = password.length >= 8;

    setPasswordStatus(isPasswordValid ? 'success' : 'error');

    // Enable the "Next" button only when both passwords are valid
    setPasswordsAreVerified(isPasswordValid && confirmPasswordStatus === 'success');
  };

  // Validate confirm password
  const validateConfirmPassword = () => {
    const isConfirmPasswordValid = confirmPassword === password;

    setConfirmPasswordStatus(isConfirmPasswordValid ? 'success' : 'error');

    // Enable the "Next" button only when both passwords are valid
    setPasswordsAreVerified(passwordStatus === 'success' && isConfirmPasswordValid);
  };

  // Clear the error on typing for password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordStatus(null);
  };

  // Clear the error on typing for confirm password
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordStatus(null);
  };

  return (
    <div className="mt-6 h-full">
      <Stepper
        active={active}
        labels={STEPS_LABELS}
        progressBarClass="px-9"
        containerClass="h-full"
      >
        {/* Step 1: Display recovery phrase */}
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
            <RecoveryPhraseGrid isEditable />
          </div>
          <div className="flex w-full px-10 justify-between gap-x-5 pb-2 mt-4">
            <Button variant="secondary" className="w-full" asChild>
              <NavLink to={ROUTES.AUTH.NEW_WALLET.ROOT}>Back</NavLink>
            </Button>
            <Button className="w-full" onClick={nextStep} disabled={!mnemonicVerified}>
              Next
            </Button>
          </div>
        </div>

        {/* Step 2: Create password */}
        <div className="w-full h-full pt-7 px-8 flex flex-col">
          <h1 className="text-white text-h3 font-semibold">{STEPS_LABELS[0]}</h1>
          <form className="mt-9 flex-1">
            {/* New Password Input */}
            <Input
              variant="primary"
              showsErrorText={true}
              status={passwordStatus}
              errorText={passwordStatus === 'error' ? 'Password must be at least 8 characters' : ''}
              label="New password (8 characters min)"
              placeholder="Enter password"
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              onBlur={validatePassword}
              icon={passwordVisible ? <EyeOpen width={20} /> : <EyeClose width={20} />}
              iconRole="button"
              onIconClick={() => setPasswordVisible(!passwordVisible)}
              wrapperClass="mb-4"
            />

            {/* Confirm Password Input */}
            <Input
              variant="primary"
              showsErrorText={true}
              status={confirmPasswordStatus}
              errorText={confirmPasswordStatus === 'error' ? 'Passwords do not match' : ''}
              label="Confirm password"
              placeholder="Repeat password"
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={validateConfirmPassword}
              icon={confirmPasswordVisible ? <EyeOpen width={20} /> : <EyeClose width={20} />}
              iconRole="button"
              onIconClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            />
          </form>

          <div className="flex w-full justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" onClick={prevStep}>
              Back
            </Button>
            <Button className="w-full" onClick={handleCreateWallet} disabled={!fullyVerified}>
              Next
            </Button>
          </div>
        </div>

        {/* Final step: Wallet creation success */}
        {active === 2 && <WalletSuccessScreen caption="Your wallet was imported successfully" />}
      </Stepper>
    </div>
  );
};
