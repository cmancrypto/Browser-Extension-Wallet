import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft, QRCode, Swap } from '@/assets/icons';
import { GREATER_EXPONENT_DEFAULT, ROUTES } from '@/constants';
import { cn } from '@/helpers/utils';
import { Button, Input, Separator } from '@/ui-kit';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { Asset } from '@/types';
import { getSessionToken, sendTransaction, swapTransaction } from '@/helpers';
import { AssetSelectDialog } from '@/components/AssetSelectDialog';

// TODO: add account selection after saving accounts
// const SELECT_ACCOUNT = [{ id: 'account1', name: 'MLD', balance: '1504 MLD' }];
// const avatarUrl = chrome?.runtime?.getURL('avatar.png');
export const Send = () => {
  const location = useLocation();
  const selectedSendAsset = location.state?.selectedSendAsset;

  const walletState = useAtomValue(walletStateAtom);
  const walletAssets = walletState?.assets || [];
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAsset, setSendAsset] = useState<Asset | null>(selectedSendAsset || null);
  const [receiveAsset, setReceiveAsset] = useState<Asset | null>(null);
  const [sendAmount, setSendAmount] = useState('1');
  const [receiveAmount, setReceiveAmount] = useState('');

  const handleSend = async () => {
    console.log('Handling send...');
    const sessionToken = getSessionToken();
    console.log('Send page, Session token:', sessionToken);
    console.log('Send page, Wallet state', walletState);

    if (!sendAsset) return;
    const assetToSend = walletAssets.find(a => a.denom === sendAsset.denom);
    if (!assetToSend) return;

    const adjustedAmount = (
      parseFloat(sendAmount) * Math.pow(10, assetToSend.exponent || GREATER_EXPONENT_DEFAULT)
    ).toFixed(0); // No decimals, as this is sending the minor unit, not the greater.

    console.log('Adjusted amount:', adjustedAmount);

    const sendObject = {
      recipientAddress,
      amount: adjustedAmount,
      denom: sendAsset.denom,
    };

    try {
      if (sendAsset === receiveAsset) {
        // TODO: change gas and fee calculations
        // TODO: show max and min for gas fees, show actual amount taken for transaction fee.  from simulated send?
        sendTransaction(walletState.address, sendObject);
      } else if (receiveAsset) {
        const swapObject = { sendObject, resultDenom: receiveAsset.denom };
        swapTransaction(walletState.address, swapObject);
      }
    } catch (error) {
      console.error('Error broadcasting transaction', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Top bar with back button and title */}
      <div className="flex justify-between items-center w-full p-5">
        <NavLink
          to={ROUTES.APP.ROOT}
          className="flex items-center justify-center max-w-5 max-h-5 p-0.5"
        >
          <ArrowLeft className="w-full h-full text-white" />
        </NavLink>
        <h1 className="text-h5 text-white font-bold">Send</h1>
        <div className="max-w-5 w-full max-h-5" />
      </div>

      {/* Content container */}
      <div className="flex flex-col justify-between flex-grow p-4 border border-neutral-2 rounded-lg overflow-y-auto">
        {/* Address Input */}
        <div className="">
          <div className="flex items-center mb-4 space-x-2">
            <label className="text-sm text-neutral-1 whitespace-nowrap">Send to:</label>
            <div className="flex-grow">
              <Input
                variant="primary"
                placeholder="Wallet Address or ICNS"
                // TODO: make QRCode functional with drag/drop, file selection, and/or camera access
                icon={<QRCode width={20} />}
                value={recipientAddress}
                onChange={e => setRecipientAddress(e.target.value)}
                className="text-white w-full"
              />
            </div>
          </div>

          {/* Separator */}
          <Separator variant="top" />

          {/* Send Section */}
          <div className="flex items-center mb-4 space-x-2">
            <label className="text-sm text-neutral-1 whitespace-nowrap">Sending:</label>
            <div className="flex-grow">
              <Input
                variant="primary"
                value={sendAmount}
                onChange={e => setSendAmount(e.target.value)}
                icon={
                  <AssetSelectDialog
                    selectedAsset={sendAsset}
                    isSendDialog={true}
                    onClick={setSendAsset}
                  />
                }
                className={cn('p-2.5 text-white border border-neutral-2 rounded-md w-full h-10')}
              />
            </div>
          </div>

          {/* Separator with reverse icon */}
          <div className="flex justify-center my-4">
            {/* TODO: onlick switch send and receive assets, prioritize new send amount for conversion */}
            <Button className="rounded-md h-9 w-9 bg-neutral-3" onClick={() => {}}>
              <Swap />
            </Button>
          </div>

          {/* Receive Section */}
          <div className="flex items-center mb-4 space-x-2">
            <label className="text-sm text-neutral-1 whitespace-nowrap">Receiving:</label>
            <div className="flex-grow">
              <Input
                variant="primary"
                value={receiveAmount}
                onChange={e => setReceiveAmount(e.target.value)}
                icon={
                  <AssetSelectDialog
                    selectedAsset={receiveAsset}
                    isSendDialog={false}
                    onClick={setReceiveAsset}
                  />
                }
                className={cn('p-2.5 text-white border border-neutral-2 rounded-md w-full h-10')}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-grow" />

        {/* Fee Section */}
        <div className="flex justify-between items-center text-blue text-sm font-bold">
          <p>Fee</p>
          <p>0.0004 MLD</p>
        </div>

        {/* TODO: add separator over this button */}
        {/* TODO: move fee to just above send button */}
        {/* Send Button */}
        <div className="mt-4">
          <Button className="w-full" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
