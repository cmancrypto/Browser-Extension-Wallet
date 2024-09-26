import React, { useState, useRef, useEffect } from 'react';
import { Copy, EyeClose, EyeOpen } from '@/assets/icons';
import { cn } from '@/helpers/utils';
import { Button, Input } from '@/ui-kit';
import { EnglishMnemonic } from '@cosmjs/crypto';
import { useAtom, useSetAtom } from 'jotai';
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
  const [use24Words, setUse24Words] = useAtom(use24WordsState);
  const setMnemonicVerified = useSetAtom(mnemonicVerifiedState);

  // User input state tracking
  const [localMnemonic, setLocalMnemonic] = useState<string[]>([]);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [shadow, setShadow] = useState<string>('');
  const phraseBoxRef = useRef<HTMLDivElement>(null);

  // State for border colors and validation allowance
  const [inputBorderColors12, setInputBorderColors12] = useState<{ [key: number]: string }>({});
  const [inputBorderColors24, setInputBorderColors24] = useState<{ [key: number]: string }>({});
  const [allowValidation12, setAllowValidation12] = useState<{ [key: number]: boolean }>({});
  const [allowValidation24, setAllowValidation24] = useState<{ [key: number]: boolean }>({});
  const [isFocused, setIsFocused] = useState<number | null>(null);

  const getCurrentMnemonic = () => (use24Words ? mnemonic24 : mnemonic12);
  const maxWords = use24Words ? 24 : 12;

  const inputBorderColors = use24Words ? inputBorderColors24 : inputBorderColors12;
  const setInputBorderColors = use24Words ? setInputBorderColors24 : setInputBorderColors12;

  const allowValidation = use24Words ? allowValidation24 : allowValidation12;
  const setAllowValidation = use24Words ? setAllowValidation24 : setAllowValidation12;

  const handleShowPhrase = () => setIsShown(prev => !prev);

  const validateWord = (word: string) => EnglishMnemonic.wordlist.includes(word);

  const handleCopyToClipboard = () => navigator.clipboard.writeText(localMnemonic.join(' '));

  // Copy local state to global state
  const updateMnemonic = (mnemonic: string[]) => {
    console.log('updating mnemonic with', mnemonic);
    use24Words ? setMnemonic24(mnemonic) : setMnemonic12(mnemonic);
  };

  // Validate all of local mnemonic
  const validateFullMnemonic = () => {
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

  // Specific case: Validate all of hidden words
  const checkAllHiddenWordsVerified = () => {
    const allHiddenWordsVerified = hiddenIndexes.every(
      index => localMnemonic[index] === getCurrentMnemonic()[index],
    );
    setMnemonicVerified(allHiddenWordsVerified);

    if (allHiddenWordsVerified) {
      updateMnemonic(localMnemonic);
    }
  };

  // Route logic.  Check full mnemonic both hidden and editable
  const checkFullMnemonic = () => {
    // In verify mode, check the hidden indexes
    if (isVerifyMode) {
      checkAllHiddenWordsVerified();
    } else {
      // Check if all words are valid and form a complete mnemonic
      const isComplete = localMnemonic.every(word => word.trim().length > 0 && validateWord(word));
      // If all words are valid, mark the mnemonic as verified
      if (isComplete) {
        validateFullMnemonic();
      } else {
        setMnemonicVerified(false);
      }
    }
  };

  // Update local mnemonic with global state
  useEffect(() => {
    setLocalMnemonic(
      getCurrentMnemonic().map((word, index) => (hiddenIndexes.includes(index) ? '' : word)),
    );
  }, [isVerifyMode, use24Words]);

  // Verify full mnemonic on change
  useEffect(() => {
    console.log('local mnemonic', localMnemonic);
    checkFullMnemonic();
  }, [localMnemonic]);

  // Update allow validation status for specific index
  const checkVerifyStatus = (index: number, value: string) => {
    // Reset validation when field is empty
    if (value === '') {
      console.log('update allow validate and border on empty string');
      setAllowValidation(prev => ({
        ...prev,
        [index]: false,
      }));
      setInputBorderColors(prev => ({
        ...prev,
        [index]: '',
      }));
    } else if (!allowValidation[index] && (validateWord(value) || value.length > 3)) {
      console.log('update allow validation to false');
      // Allow validation if word is valid or if word length exceeds 3
      setAllowValidation(prev => ({
        ...prev,
        [index]: true,
      }));
    }
  };

  const onChangeInput = (index: number, value: string) => {
    const trimmedValue = value.trim();

    setLocalMnemonic(prev => {
      const updated = [...prev];
      updated[index] = trimmedValue;
      return updated;
    });

    if (allowValidation[index]) {
      const isValid = validateWord(trimmedValue);
      setInputBorderColors(prev => ({
        ...prev,
        [index]: isValid ? 'border-success' : 'border-error',
      }));
    }

    checkVerifyStatus(index, trimmedValue);
  };

  const handlePaste = (userSelectIndex: number, pastedValue: string) => {
    const words = pastedValue.trim().split(/\s+/);
    let currentWordIndex = 0;

    // If pasting more words than available slots, start from index 0
    const maxNumSlots = isVerifyMode ? hiddenIndexes.length : maxWords;
    const fillingAllSlots = words.length >= maxNumSlots;

    // Target indices start as the set of hidden indices or all indices
    let targetIndices = isVerifyMode
      ? hiddenIndexes
      : Array.from({ length: maxWords }, (_, i) => i);
    // If not filling all slots, cut target indices to only relevant ones
    if (!fillingAllSlots) {
      const pasteStartIndex = targetIndices.indexOf(userSelectIndex);
      const numRemainingIndices = targetIndices.length - pasteStartIndex;
      targetIndices = targetIndices.slice(pasteStartIndex, pasteStartIndex + numRemainingIndices);
    }

    const pastedIndices: number[] = [];
    setLocalMnemonic(prev => {
      const updated = [...prev];
      for (let i = 0; i < targetIndices.length && currentWordIndex < words.length; i++) {
        const targetIndex = targetIndices[i];
        updated[targetIndex] = words[currentWordIndex++];
        pastedIndices.push(targetIndex);
      }

      updated.forEach((word, idx) => {
        if (pastedIndices.includes(idx)) {
          const isValid = validateWord(word);
          setInputBorderColors(prev => ({
            ...prev,
            [idx]: isValid ? 'border-success' : 'border-error',
          }));
          setAllowValidation(prev => ({
            ...prev,
            [idx]: true,
          }));
        }
      });

      return updated;
    });

    checkFullMnemonic();
  };

  const handlePasteEvent = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    // Extract the pasted text
    const pastedText = e.clipboardData.getData('text');

    // Call your custom handlePaste function
    handlePaste(index, pastedText);
  };

  const handleBlur = (index: number, value: string) => {
    const trimmedValue = value.trim();
    setIsFocused(null);

    const isValidWord = validateWord(trimmedValue);

    setInputBorderColors(prev => ({
      ...prev,
      [index]: isValidWord ? 'border-success' : 'border-error',
    }));
    setAllowValidation(prev => ({
      ...prev,
      [index]: true,
    }));

    if (!isValidWord) {
      setMnemonicVerified(false);
    }

    checkFullMnemonic();
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
    <>
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
                      onPaste={handlePasteEvent(index)}
                      onBlur={() => handleBlur(index, localMnemonic[index])}
                      onFocus={() => handleFocus(index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      value={
                        isShown || isFocused === index
                          ? localMnemonic[index]
                          : localMnemonic[index]
                            ? '*****'
                            : ''
                      }
                      className={cn(
                        'border text-white text-sm rounded-3xl h-6 px-2 py-1 pb-[5px] w-full focus:outline-0 text-center',
                        inputBorderColors[index] ||
                          (isFocused === index ? 'border-blue' : 'border-gray-500'),
                      )}
                    />
                  ) : (
                    <Input
                      type="text"
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
      </div>
    </>
  );
};
