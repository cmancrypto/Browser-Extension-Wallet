import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { Copy, VerifySuccess } from '@/assets/icons';
import { Button, DialogContent } from '@/ui-kit';
import logo from '@/assets/images/logo.svg';

export const ReceiveDialog: React.FC = () => {
  const walletState = useAtomValue(walletStateAtom);
  const walletAddress = walletState.address;

  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    // Reset after 0.75 seconds
    setTimeout(() => setCopied(false), 750);
  };

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
          <Button variant="transparent" size="small" onClick={handleCopyToClipboard}>
            <div className="flex items-center py-1.5 px-2 mt-4 rounded-full border border-neutral-2 h-8">
              {copied ? (
                <VerifySuccess width={20} className="text-success animate-scale-up" />
              ) : (
                <Copy width={14} className="text-neutral-1 ml-1" />
              )}
              <span className="text-sm text-white ml-1.5">{walletAddress}</span>
            </div>
          </Button>

          {/* Close Button */}
          <Button className="mt-6 w-[56%] py-3 rounded-full text-lg">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
