import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { EyeOpen, EyeClose } from '@/assets/icons';
import { RecoveryPhraseGrid, WalletSuccessScreen } from '@/components';
import { ROUTES } from '@/constants';
import { Button, Input, Stepper } from '@/ui-kit';
import { createWallet, generateToken } from '@/helpers/wallet';
import { useAtom } from 'jotai';
import { mnemonic12State, mnemonic24State, mnemonicVerifiedState, use24WordsState } from '@/atoms';

const STEPS_LABELS = ['Create password', 'Recovery phrase', 'Verify phrase'];

export const CreateWallet = () => {
  const [active, setActive] = useState(0);
  const [mnemonic12, setMnemonic12] = useAtom(mnemonic12State);
  const [mnemonic24, setMnemonic24] = useAtom(mnemonic24State);
  const [use24Words, setUse24Words] = useAtom(use24WordsState);
  const [mnemonicVerified, setMnemonicVerified] = useAtom(mnemonicVerifiedState);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<'error' | 'success' | null>(null);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<'error' | 'success' | null>(
    null,
  );
  const [passwordsAreVerified, setPasswordsAreVerified] = useState(false);

  // Proceed to next step
  const nextStep = () => setActive(current => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));

  // Select random hidden indexes for verification step
  const getRandomIndexes = () => {
    const phraseLength = use24Words ? 24 : 12;
    const indexes = Array.from(Array(phraseLength).keys());
    const shuffled = indexes.sort(() => 0.5 - Math.random());
    const sortedRandomIndices = shuffled.slice(0, 3).sort((a, b) => a - b); // Sort numerically
    return sortedRandomIndices;
  };

  const [randomHiddenIndexes, setRandomHiddenIndexes] = useState(getRandomIndexes());

  // Generate the mnemonic phrases on component mount
  useEffect(() => {
    const generateMnemonics = async () => {
      const wallet12 = await Secp256k1HdWallet.generate(12);
      const wallet24 = await Secp256k1HdWallet.generate(24);
      setMnemonic12(wallet12.mnemonic.split(' '));
      setMnemonic24(wallet24.mnemonic.split(' '));
    };

    generateMnemonics();
  }, []);

  useEffect(() => {
    if (active !== 2) {
      setMnemonicVerified(false);
      // Reset verification words on change of screen
      setRandomHiddenIndexes(getRandomIndexes());
    }
  }, [active]);

  const getCurrentMnemonic = () => (use24Words ? mnemonic24 : mnemonic12);
  const getStringMnemonic = () => getCurrentMnemonic().join(' ');

  const clearState = () => {
    setMnemonic12(new Array(12).fill(''));
    setMnemonic24(new Array(24).fill(''));
    setUse24Words(false);
    setMnemonicVerified(false);
  };

  // Copy recovery phrase to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getStringMnemonic());
  };

  // Regenerate random indexes when use24Words is toggled
  useEffect(() => {
    setRandomHiddenIndexes(getRandomIndexes());
  }, [use24Words]);

  /* Auth TODOs */
  // TODO: fix titles and subtitles on import pages (and check create pages)
  // TODO: password error fields, ensure no focus
  // TODO: password verify on completion of typing.  don't confirm or deny on empty string, clear on typing
  // TODO: if confirm password is empty, don't validate.  if testpass changes and confirm password has text, auto-verify
  // TODO: show feedback on click of copy button to show it was copied.  check mark with timeout?
  // TODO: do not mark error for empty text fields in phrases
  // TODO: 12 words and 24 words should maintain different validity fields.  it's showing on 12 instead, even when 24 has no words.
  // TODO: 24 words does not show box shadow initially
  // TODO: hiding words not working for import screen
  // TODO: for default on text, ensure no focus and basic mouse onHover (no change)
  // TODO: congratulations page still showing 4th index.  remove that
  // TODO: handle error printout (in place of subtitle on verify screen?)
  // TODO: test path and create error for no wallet exists and user attempts login

  /* Inside wallet TODOs */
  // TODO: add asset list
  // TODO: add send transaction
  // TODO: add qr code screen for receive
  // TODO: add swap transaction
  // TODO: create add wallet screen to allow management of multiple accounts
  // TODO: add save wallet screen for saving preferred received assets per wallet and wallet name/identifier (for those user sends to)
  // TODO: add qr code screen for transfer data (including account data).  or from google
  // TODO: add slide tray for asset selections (like on mobile)

  /* Nice to have TODOs */
  // TODO: show green or red border for passphrase box on full verify, clear on start of typing
  // TODO: clear green or red border for passphrase words on start of typing
  // TODO: split screens out to other files
  // TODO: extract password component out to own file

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
        {/* Step 1: Create password */}
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
            <Button variant="secondary" className="w-full" asChild>
              <NavLink to={ROUTES.AUTH.NEW_WALLET.ROOT}>Back</NavLink>
            </Button>
            <Button className="w-full" onClick={nextStep} disabled={!passwordsAreVerified}>
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
            <RecoveryPhraseGrid />
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
            {/* TODO: handle hidden indexes with copy mnemonic */}
            <RecoveryPhraseGrid isVerifyMode={true} hiddenIndexes={randomHiddenIndexes} />
          </div>
          <div className="flex w-full px-10 justify-between gap-x-5 pb-2">
            <Button variant="secondary" className="w-full" onClick={prevStep}>
              Back
            </Button>
            <Button className="w-full" onClick={handleCreateWallet} disabled={!mnemonicVerified}>
              Next
            </Button>
          </div>
        </div>

        {/* Final step: Wallet creation success */}
        {active === 3 && <WalletSuccessScreen caption="Your wallet was created successfully" />}
      </Stepper>
    </div>
  );
};
