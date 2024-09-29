import React from 'react';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { Button, DialogContent } from '@/ui-kit';
import logo from '@/assets/images/logo.svg';
import { CopyTextField } from '../CopyTextField';
import { truncateString } from '@/helpers';
import { WALLET_PREFIX } from '@/constants';

export const ReceiveDialog: React.FC = () => {
  const walletState = useAtomValue(walletStateAtom);
  const walletAddress = walletState.address;

  const walletDisplayAddress = truncateString(WALLET_PREFIX, walletAddress);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Receive
        </Button>
      </DialogTrigger>
      <DialogContent className="slide-in-from-bottom">
        <div className="flex flex-col items-center pt-10 pb-16">
          <h3 className="text-h5 font-bold">Copy Address</h3>

          {/* QR Code container */}
          <div className="relative flex justify-center items-center bg-background-black mt-5 rounded-2xl border-4 border-blue w-[260px] h-[260px]">
            <QRCodeSVG
              value={walletAddress}
              size={240}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="Q"
              imageSettings={{
                src: logo,
                height: 75,
                width: 75,
                excavate: true,
              }}
            />
          </div>

          {/* TODO: remove? */}
          <p className="text-sm text-neutral-1 mt-4">Scan address to receive payment</p>

          {/* Wallet Address */}
          <CopyTextField
            variant="transparent"
            displayText={walletDisplayAddress}
            copyText={walletAddress}
            iconHeight={14}
          ></CopyTextField>

          {/* Close Button */}
          <Button className="mt-6 w-[56%] py-3 rounded-full text-lg">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
