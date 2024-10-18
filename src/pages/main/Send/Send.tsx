import { Select, SelectValue } from '@radix-ui/react-select';
import { Fragment, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { ArrowLeft, LogoIcon, QRCode } from '@/assets/icons';
import { GREATER_EXPONENT_DEFAULT, LOCAL_ASSET_REGISTRY, ROUTES } from '@/constants';
import { cn } from '@/helpers/utils';
import { Button, Input, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/ui-kit';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { Asset } from '@/types';
import { getSessionToken, sendTransaction, swapTransaction } from '@/helpers';

// TODO: add account selection after saving accounts
// const SELECT_ACCOUNT = [{ id: 'account1', name: 'MLD', balance: '1504 MLD' }];
// const avatarUrl = chrome?.runtime?.getURL('avatar.png');

export const Send = () => {
  const location = useLocation();
  const selectedSendAsset = location.state?.selectedSendAsset;
  console.log('send page');
  console.log('send asset:', selectedSendAsset);

  const walletState = useAtomValue(walletStateAtom);
  const walletAssets = walletState?.assets || [];
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAsset, setSendAsset] = useState<Asset | null>(selectedSendAsset || null);
  const [receiveAsset, setReceiveAsset] = useState<Asset | null>(null);
  const [amount, setAmount] = useState('1');

  const handleSend = async () => {
    console.log('Handling send...');
    const sessionToken = getSessionToken();
    console.log('Send page, Session token:', sessionToken);
    console.log('Send page, Wallet state', walletState);

    if (sendAsset === null) {
      return;
    }

    const assetToSend = walletAssets.find(a => a.denom === sendAsset.denom);
    if (!assetToSend) {
      console.error('Selected asset to send not found in wallet assets.');
      return;
    }

    const adjustedAmount = (
      parseFloat(amount) * Math.pow(10, assetToSend.exponent || GREATER_EXPONENT_DEFAULT)
    ).toFixed(0); // No decimals, as this is sending the minor unit, not the greater.

    console.log('Adjusted amount:', adjustedAmount);

    const sendObject = {
      recipientAddress: recipientAddress,
      amount: adjustedAmount,
      denom: sendAsset.denom,
    };

    try {
      if (sendAsset === receiveAsset) {
        // TODO: change gas and fee calculations
        // TODO: show max and min for gas fees, show actual amount taken for transaction fee.  from simulated send?
        sendTransaction(walletState.address, sendObject);
      } else {
        if (receiveAsset === null) {
          return;
        }
        // Perform a swap transaction
        const swapObject = { sendObject, resultDenom: receiveAsset.denom };

        console.log('swapMsg details:', swapObject);

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
      <div className="flex flex-col justify-between flex-grow p-4 border border-neutral-2 rounded-lg mt-5 overflow-y-auto">
        {/* Address input */}
        <Input
          variant="primary"
          placeholder="Wallet Address or ICNS"
          icon={<QRCode width={20} />}
          value={recipientAddress}
          onChange={e => setRecipientAddress(e.target.value)}
          className="text-white mb-4"
        />

        {/* Send Asset selection */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-neutral-1">Send As</label>
          <Select
            defaultValue={sendAsset?.denom || ''}
            onValueChange={value => {
              const asset = walletAssets.find(a => a.denom === value);
              setSendAsset(asset || null);
            }}
          >
            <SelectTrigger className="max-w-56 py-2.5">
              <SelectValue placeholder="Asset to Send" />
            </SelectTrigger>
            <SelectContent>
              {walletAssets.map((asset: Asset, index, array) => (
                <Fragment key={asset.denom}>
                  <SelectItem value={asset.denom}>
                    <div className="flex items-center text-left">
                      <div className="rounded-full w-7 h-7 bg-neutral-2 p-2 flex items-center justify-center">
                        <LogoIcon />
                      </div>
                      <div className="flex flex-col ml-3">
                        <p className="text-base text-white">{asset.symbol}</p>
                      </div>
                    </div>
                  </SelectItem>
                  {index + 1 !== array.length && <SelectSeparator />}
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Receive Asset selection */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-neutral-1">Receive As</label>
          <Select
            defaultValue=""
            onValueChange={value => {
              const asset = walletAssets.find(a => a.denom === value);
              setReceiveAsset(asset || null);
            }}
          >
            <SelectTrigger className="max-w-56 py-2.5">
              <SelectValue placeholder="Asset to Receive" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LOCAL_ASSET_REGISTRY).map((asset: Asset, index, array) => (
                <Fragment key={asset.denom}>
                  <SelectItem value={asset.denom}>
                    <div className="flex items-center text-left">
                      <div className="rounded-full w-7 h-7 bg-neutral-2 p-2 flex items-center justify-center">
                        <LogoIcon />
                      </div>
                      <div className="flex flex-col ml-3">
                        <p className="text-base text-white">{asset.symbol}</p>
                      </div>
                    </div>
                  </SelectItem>
                  {index + 1 !== array.length && <SelectSeparator />}
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount input */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-neutral-1">Amount</label>
          <Input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className={cn(
              'p-2.5 bg-neutral-2 text-white border border-neutral-2 rounded-md max-w-56 w-full h-10',
              'hover:border-neutral-1',
              'focus:outline-0 focus:border-blue focus:text-white',
            )}
          />
        </div>

        {/* TODO: link to single source of truth for fee */}
        {/* Fee */}
        <div className="flex justify-between items-center text-blue text-sm font-bold">
          <p>Fee</p>
          <p>0.0004 MLD</p>
        </div>

        {/* Send Button */}
        <div className="mt-8">
          <Button className="w-full" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
