import React from 'react';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { Button, CopyTextField, SlideTray } from '@/ui-kit';
import { truncateString } from '@/helpers';
import { WALLET_PREFIX } from '@/constants';
import { QRCodeContainer } from '../QRCodeContainer';

interface ValidatorSelectDialogProps {
  buttonText: string;
  buttonVariant?: string;
}

export const ValidatorSelectDialog: React.FC<ValidatorSelectDialogProps> = ({
  buttonText,
  buttonVariant,
}) => {
  const walletState = useAtomValue(walletStateAtom);
  const walletAddress = walletState.address;

  const walletDisplayAddress = truncateString(WALLET_PREFIX, walletAddress);

  return (
    <SlideTray
      triggerComponent={
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      }
      title="Copy Address"
      closeButtonVariant="bottom-center"
    >
      <div className="flex flex-col items-center">
        <QRCodeContainer qrCodeValue={walletAddress} />

        {/* Wallet Address */}
        <CopyTextField
          variant="transparent"
          displayText={walletDisplayAddress}
          copyText={walletAddress}
          iconHeight={16}
        />
      </div>
    </SlideTray>
  );
};
