import { ClassValue } from 'clsx';
import React, { useMemo, useState } from 'react';

import { Copy, EyeOpen } from '@/assets/icons';
import { cn } from '@/helpers/utils';
import { Button, Input } from '@/ui-kit';

type RecoveryPhraseGridProps = {
  phrase: { id: number; value: string }[];
  withButtons?: boolean;
  showPhrase?: boolean;
  verifyPhrase?: boolean;
};

const HIDDEN_INDEXES = [1, 5, 8];

export const RecoveryPhraseGrid: React.FC<RecoveryPhraseGridProps> = ({
  phrase,
  withButtons = false,
  showPhrase = true,
  verifyPhrase = false,
}) => {
  const [isShown, setIsShown] = useState<boolean>(!!showPhrase);

  const joinedPhraseString = useMemo(() => phrase.map(word => word.value).join(' '), [phrase]);

  const resultPhrase = useMemo(() => {
    if (!verifyPhrase) return phrase;

    const result = phrase.map((item, index) =>
      HIDDEN_INDEXES.includes(index) ? { id: item.id, value: '' } : item,
    );

    return result;
  }, [phrase, verifyPhrase]);

  const handleShowPhrase = () => {
    setIsShown(prevState => !prevState);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(joinedPhraseString);
  };

  return (
    <div className="w-full">
      <ul className="grid grid-cols-3 gap-y-2.5 gap-x-2.5 p-2.5 border border-grey rounded-lg">
        {resultPhrase.map((word, index) => (
          <li key={word.id} className="inline-flex items-center max-w-full">
            <span className="mr-1 text-base/[25px] text-white w-5 text-left">{index + 1}.</span>
            <Input
              className={cn(
                'border border-white text-white rounded-3xl h-[30px] px-3 py-1.5 w-full focus:outline-0 text-center',
                (verifyPhrase && HIDDEN_INDEXES.includes(index) && 'border-blue') as ClassValue,
              )}
              value={isShown ? word.value : '*****'}
            />
          </li>
        ))}
      </ul>
      {withButtons && (
        <div className="flex justify-between px-5 mt-4">
          <Button variant="transparent" size="small" onClick={handleShowPhrase}>
            <EyeOpen />
            <span className="ml-2.5 text-lg">Hide seed phrase</span>
          </Button>
          <Button variant="transparent" size="small" onClick={handleCopyToClipboard}>
            <Copy />
            <span className="ml-2.5 text-lg">Copy to clipboard</span>
          </Button>
        </div>
      )}
    </div>
  );
};
