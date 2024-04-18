import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import React from 'react';

import { Copy } from '@/assets/icons';
import { Button, DialogContent } from '@/ui-kit';

const qrcodeUrl = chrome?.runtime?.getURL('qr-code.svg');

export const ReceiveDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="secondary" className="w-full">
        Receive
      </Button>
    </DialogTrigger>
    <DialogContent>
      <div className="flex flex-col items-center pt-10 pb-16">
        <h3 className="text-h5 font-bold">Receive</h3>
        <div className="relative h-56 w-56 bg-background-dark-grey p-7 mt-5 rounded-2xl border-4 border-blue">
          <span className="absolute h-1 w-2/5 top-[-4px] left-0 right-0 m-auto bg-background-dialog-bg" />
          <span className="absolute w-1 h-2/5 right-[-4px] top-0 bottom-0 m-auto bg-background-dialog-bg" />
          <span className="absolute h-1 w-2/5 bottom-[-4px] left-0 right-0 m-auto bg-background-dialog-bg" />
          <span className="absolute w-1 h-2/5 left-[-4px] top-0 bottom-0 m-auto bg-background-dialog-bg" />
          <img className="w-full h-full" src={qrcodeUrl} alt="Receive QR code" />
        </div>
        <p className="text-sm text-neutral-1 mt-4">Scan address to receive payment</p>
        <div
          role="button"
          className="flex items-center py-1.5 px-2 mt-4 rounded-full border border-neutral-2 h-8"
        >
          <span className="text-sm text-white ml-1.5">0х75b05...0E8c</span>
          <Copy width="14px" className="text-neutral-1 ml-1" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
