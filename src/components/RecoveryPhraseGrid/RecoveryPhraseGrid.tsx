import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Copy, EyeClose, EyeOpen } from '@/assets/icons';
import { EMPTY_RECOVERY_PHRASE } from '@/constants';
import { cn } from '@/helpers/utils';
import { Button, Input } from '@/ui-kit';

type RecoveryPhraseGridProps = {
  phrase?: { id: number; value: string }[];
  withButtons?: boolean;
  isVerifyMode?: boolean;
  hiddenIndexes?: number[];
  handleResult?: (allVerified: boolean) => void;
};

export const RecoveryPhraseGrid: React.FC<RecoveryPhraseGridProps> = ({
  phrase,
  withButtons = false,
  isVerifyMode = false,
  hiddenIndexes = [],
  handleResult,
}) => {
  const [isShown, setIsShown] = useState<boolean>(isVerifyMode ? false : true);
  const [shadow, setShadow] = useState<string>('');
  const phraseBoxRef = useRef<HTMLDivElement>(null);
  const [userInput, setUserInput] = useState<{ [key: number]: string }>({});
  const [inputBorderColors, setInputBorderColors] = useState<{ [key: number]: string }>({});

  const resultPhrase = useMemo(() => {
    // TODO: this is called from import wallet.  generate and pass empty 12 or 24 word phrase from there, then remove
    if (!phrase) return EMPTY_RECOVERY_PHRASE;

    if (isVerifyMode) {
      // Hide the words at the passed hiddenIndexes
      return phrase.map((item, index) =>
        hiddenIndexes.includes(index) ? { id: item.id, value: '' } : item,
      );
    }

    return phrase;
  }, [phrase, isVerifyMode, hiddenIndexes]);

  const handleShowPhrase = () => setIsShown(prevState => !prevState);

  const handleCopyToClipboard = () => {
    const joinedPhraseString = phrase?.map(word => word.value).join(' ') || '';
    navigator.clipboard.writeText(joinedPhraseString);
  };

  const checkAllVerified = () => {
    if (isVerifyMode && handleResult && phrase) {
      const allVerified = hiddenIndexes.every(
        i => userInput[i] && phrase[i].value.toLowerCase() === userInput[i].toLowerCase(),
      );

      if (allVerified) {
        handleResult(true);
      } else {
        handleResult(false);
      }
    }
  };

  const onChangeInput = (index: number, value: string) => {
    const trimmedValue = value.trim();

    // Update the input value and re-verify
    setUserInput(prev => ({ ...prev, [index]: trimmedValue }));
  };

  const handleBlur = (index: number, value: string) => {
    const trimmedValue = value.trim();

    if (phrase && phrase[index].value.toLowerCase() === trimmedValue.toLowerCase()) {
      setInputBorderColors(prev => ({ ...prev, [index]: 'border-success' }));
    } else {
      setInputBorderColors(prev => ({ ...prev, [index]: 'border-error' }));
    }

    checkAllVerified();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      handleBlur(index, userInput[index] || '');
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
  }, [phrase]);

  return (
    <div className="w-full">
      <div
        ref={phraseBoxRef}
        className="overflow-auto min-h-[160px] max-h-[160px] border border-grey rounded-lg p-2.5 hide-scrollbar"
        style={{ boxShadow: shadow }}
      >
        <ul className="grid grid-cols-3 gap-y-3.5 gap-x-2.5">
          {resultPhrase.map((word, index) => (
            <li key={word.id} className="inline-flex items-center max-w-full">
              <span className="mr-1 text-sm/[24px] text-white w-5 text-left">{index + 1}.</span>

              {isVerifyMode && hiddenIndexes.includes(index) ? (
                <Input
                  type="text"
                  onChange={e => onChangeInput(index, e.target.value)}
                  onBlur={() => handleBlur(index, userInput[index] || '')}
                  onKeyDown={e => handleKeyDown(e, index)}
                  value={userInput[index] || ''}
                  className={cn(
                    'border text-white text-sm rounded-3xl h-6 px-2 py-1 pb-[5px] w-full focus:outline-0 text-center',
                    inputBorderColors[index] || 'border-blue',
                  )}
                />
              ) : (
                <Input
                  type="password"
                  readOnly={!isVerifyMode}
                  tabIndex={-1}
                  className={cn(
                    'border border-white text-white text-sm rounded-3xl h-6 px-2 py-1 pb-[5px] w-full focus:outline-0 text-center',
                  )}
                  value={isShown ? word.value : '*****'}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {withButtons && (
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
      )}
    </div>
  );
};
