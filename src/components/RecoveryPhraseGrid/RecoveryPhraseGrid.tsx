import React, { useState, useRef, useEffect } from 'react';
import { Copy, EyeClose, EyeOpen } from '@/assets/icons';
import { cn } from '@/helpers/utils';
import { Button, Input } from '@/ui-kit';
import { EnglishMnemonic } from '@cosmjs/crypto';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { mnemonic12State, mnemonic24State, mnemonicVerifiedState, use24WordsState } from '@/atoms';

type RecoveryPhraseGridProps = {
  isVerifyMode?: boolean;
  hiddenIndexes?: number[];
  isEditable?: boolean;
};

export const RecoveryPhraseGrid: React.FC<RecoveryPhraseGridProps> = ({
  isVerifyMode = false,
  hiddenIndexes = [],
  isEditable = false,
}) => {
  const [mnemonic12, setMnemonic12] = useAtom(mnemonic12State);
  const [mnemonic24, setMnemonic24] = useAtom(mnemonic24State);
  const use24Words = useAtomValue(use24WordsState);
  const setMnemonicVerified = useSetAtom(mnemonicVerifiedState);

  // User input state tracking
  const [localMnemonic, setLocalMnemonic] = useState<string[]>([]);
  const [isShown, setIsShown] = useState<boolean>(!isVerifyMode);
  const [shadow, setShadow] = useState<string>('');
  const phraseBoxRef = useRef<HTMLDivElement>(null);
  const [inputBorderColors, setInputBorderColors] = useState<{ [key: number]: string }>({});
  const [isFocused, setIsFocused] = useState<number | null>(null);

  const getCurrentMnemonic = () => (use24Words ? mnemonic24 : mnemonic12);

  useEffect(() => {
    setLocalMnemonic(
      getCurrentMnemonic().map((word, index) => (hiddenIndexes.includes(index) ? '' : word)),
    );
  }, [isVerifyMode, use24Words]);

  const updateMnemonic = (mnemonic: string[]) => {
    use24Words ? setMnemonic24(mnemonic) : setMnemonic12(mnemonic);
  };

  const handleShowPhrase = () => setIsShown(prev => !prev);

  const handleCopyToClipboard = () => {
    const joinedPhraseString = localMnemonic.join(' ');
    navigator.clipboard.writeText(joinedPhraseString);
  };

  const validateWord = (word: string) => EnglishMnemonic.wordlist.includes(word);

  const checkHiddenWordsVerified = () => {
    const allHiddenWordsVerified = hiddenIndexes.every(
      index => localMnemonic[index] === getCurrentMnemonic()[index],
    );
    setMnemonicVerified(allHiddenWordsVerified);

    if (allHiddenWordsVerified) {
      // Overwrite the atom mnemonic with verified input
      updateMnemonic(localMnemonic);
    }
  };

  const onChangeInput = (index: number, value: string) => {
    const trimmedValue = value.trim();

    setLocalMnemonic(prev => {
      const updated = [...prev];
      updated[index] = trimmedValue;
      return updated;
    });
  };

  const handleBlur = (index: number, value: string) => {
    const trimmedValue = value.trim();
    setIsFocused(null);

    const isValidWord = validateWord(trimmedValue);

    setInputBorderColors(prev => ({
      ...prev,
      [index]: isValidWord ? 'border-success' : 'border-error',
    }));

    if (!isValidWord) {
      // Set mnemonicVerified to false if any word fails validation
      setMnemonicVerified(false);
    }

    // If in verify mode, check if all hidden words are verified
    if (isVerifyMode) {
      checkHiddenWordsVerified();
    } else if (localMnemonic.every(word => word.trim().length > 0)) {
      validateMnemonic();
    }
  };

  const validateMnemonic = () => {
    try {
      new EnglishMnemonic(localMnemonic.join(' '));
      setMnemonicVerified(true);
      setInputBorderColors(
        localMnemonic.reduce((acc, _, index) => ({ ...acc, [index]: 'border-success' }), {}),
      );
      updateMnemonic(localMnemonic);
    } catch (error) {
      setMnemonicVerified(false);
      setInputBorderColors(
        localMnemonic.reduce((acc, word, index) => {
          const isValid = validateWord(word);
          return { ...acc, [index]: isValid ? 'border-success' : 'border-error' };
        }, {}),
      );
    }
  };

  const handleFocus = (index: number) => setIsFocused(index);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      handleBlur(index, localMnemonic[index] || '');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = phraseBoxRef.current;
      if (!el) return;

      const scrollTop = el.scrollTop > 0;
      const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;

      const topShadow = scrollTop ? 'inset 0 12px 10px -8px rgba(255, 255, 255, 0.8)' : '';
      const bottomShadow = canScrollDown ? 'inset 0 -12px 10px -8px rgba(255, 255, 255, 0.8)' : '';

      setShadow([topShadow, bottomShadow].filter(Boolean).join(', '));
    };

    const el = phraseBoxRef.current;
    el?.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => el?.removeEventListener('scroll', handleScroll);
  }, [use24Words]);

  return (
    <div className="w-full">
      <div
        ref={phraseBoxRef}
        className="overflow-auto min-h-[160px] max-h-[160px] border border-grey rounded-lg p-2.5 hide-scrollbar"
        style={{ boxShadow: shadow }}
      >
        <ul className="grid grid-cols-3 gap-y-3.5 gap-x-2.5">
          {localMnemonic.map((word, index) => (
            <li key={index} className="inline-flex items-center max-w-full">
              <span className="mr-1 text-sm/[24px] text-white w-5 text-left">{index + 1}.</span>

              {isEditable || (isVerifyMode && hiddenIndexes.includes(index)) ? (
                <Input
                  type="text"
                  onChange={e => onChangeInput(index, e.target.value)}
                  onBlur={() => handleBlur(index, localMnemonic[index] || '')}
                  onFocus={() => handleFocus(index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  value={localMnemonic[index] || ''}
                  className={cn(
                    'border text-white text-sm rounded-3xl h-6 px-2 py-1 pb-[5px] w-full focus:outline-0 text-center',
                    inputBorderColors[index] ||
                      (isFocused === index ? 'border-blue' : 'border-gray-500'),
                  )}
                />
              ) : (
                <Input
                  type="password"
                  readOnly
                  tabIndex={-1}
                  className="border border-white text-white text-sm rounded-3xl h-6 px-2 py-1 pb-[5px] w-full focus:outline-0 text-center cursor-default"
                  value={isShown ? word : '*****'}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={`flex ${isVerifyMode ? 'justify-center' : 'justify-between px-5'} mt-3`}>
        <Button variant="transparent" size="small" onClick={handleShowPhrase}>
          {isShown ? <EyeClose height={20} /> : <EyeOpen height={20} />}
          <span className="ml-2.5 text-base">{isShown ? 'Hide' : 'Show'} seed phrase</span>
        </Button>
        {!isVerifyMode && (
          <Button variant="transparent" size="small" onClick={handleCopyToClipboard}>
            <Copy width={20} />
            <span className="ml-2.5 text-base">Copy to clipboard</span>
          </Button>
        )}
      </div>
    </div>
  );
};
