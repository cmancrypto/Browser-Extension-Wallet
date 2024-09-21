import { ClassValue } from 'clsx';
import React, { useMemo, useState } from 'react';

import { Copy, EyeClose, EyeOpen } from '@/assets/icons';
import { EMPTY_RECOVERY_PHRASE } from '@/constants';
import { cn } from '@/helpers/utils';
import { Button, Input } from '@/ui-kit';

type RecoveryPhraseGridProps = {
  phrase?: { id: number; value: string }[];
  withButtons?: boolean;
  verifyPhrase?: boolean;
  readOnly?: boolean;
  handleResult?: (index: number, value: string) => void;
};

const HIDDEN_INDEXES = [1, 5, 8];

export const RecoveryPhraseGrid: React.FC<RecoveryPhraseGridProps> = ({
  phrase,
  withButtons = false,
  verifyPhrase = false,
  readOnly = false,
  handleResult,
}) => {
  // Local state to manage visibility of the seed phrase
  const [isShown, setIsShown] = useState<boolean>(true);

  console.log('Initial visibility state (isShown):', isShown);

  const joinedPhraseString = useMemo(() => {
    console.log('Phrase being joined:', phrase);
    return phrase?.map(word => word.value).join(' ');
  }, [phrase]);

  const resultPhrase = useMemo(() => {
    if (!phrase) {
      console.log('No phrase provided, returning EMPTY_RECOVERY_PHRASE.');
      return EMPTY_RECOVERY_PHRASE;
    }

    if (!verifyPhrase) {
      console.log('verifyPhrase is false, returning original phrase.');
      return phrase;
    }

    const result = phrase?.map((item, index) =>
      HIDDEN_INDEXES.includes(index) ? { id: item.id, value: '' } : item,
    );

    console.log('Processed phrase with hidden indexes:', result);
    return result;
  }, [phrase, verifyPhrase]);

  // Toggle the visibility of the phrase
  const handleShowPhrase = () => {
    setIsShown(prevState => !prevState);
    console.log('Toggled visibility state (isShown):', !isShown);
  };

  // Copy the phrase to clipboard
  const handleCopyToClipboard = () => {
    if (!joinedPhraseString) {
      console.log('No phrase to copy, joinedPhraseString is empty.');
      return;
    }
    navigator.clipboard.writeText(joinedPhraseString);
    console.log('Copied phrase to clipboard:', joinedPhraseString);
  };

  // Handle input change for verifying the phrase
  const onChangeInput = (index: number, value: string) => {
    if (!handleResult) return;
    handleResult(index, value);
  };

  return (
    <div className="w-full">
      <ul className="grid grid-cols-3 gap-y-3.5 gap-x-2.5 p-2.5 border border-grey rounded-lg">
        {resultPhrase.map((word, index) => {
          console.log('Rendering word:', word.value, 'Visibility:', isShown ? word.value : '*****');
          return (
            <li key={word.id} className="inline-flex items-center max-w-full">
              <span className="mr-1 text-sm/[24px] text-white w-5 text-left">{index + 1}.</span>
              <Input
                type="password"
                onChange={e => onChangeInput(index, e.target.value)}
                readOnly={readOnly || (verifyPhrase && !HIDDEN_INDEXES.includes(index))}
                className={cn(
                  'border border-white text-white text-sm rounded-3xl h-6 px-2 py-1 pb-[5px] w-full focus:outline-0 text-center',
                  (verifyPhrase && HIDDEN_INDEXES.includes(index) && 'border-blue') as ClassValue,
                )}
                value={isShown ? word.value : '*****'}
              />
            </li>
          );
        })}
      </ul>

      {/* Show buttons if withButtons is true */}
      {withButtons && (
        <div className="flex justify-between px-5 mt-4">
          {/* Toggle seed phrase visibility */}
          <Button variant="transparent" size="small" onClick={handleShowPhrase}>
            {isShown ? <EyeClose height={20} /> : <EyeOpen height={20} />}
            <span className="ml-2.5 text-base">{isShown ? 'Hide' : 'Show'} seed phrase</span>
          </Button>

          {/* Copy to clipboard */}
          <Button variant="transparent" size="small" onClick={handleCopyToClipboard}>
            <Copy width={20} />
            <span className="ml-2.5 text-base">Copy to clipboard</span>
          </Button>
        </div>
      )}
    </div>
  );
};
