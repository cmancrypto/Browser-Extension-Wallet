import { Select, SelectValue } from '@radix-ui/react-select';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import { ArrowLeft, LogoIcon, QRCode } from '@/assets/icons';
import { ROUTES } from '@/constants';
import { cn } from '@/helpers/utils';
import { Button, Input, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/ui-kit';

const SELECT_ACCOUNT = [
  { id: 'account1', name: 'MLD', balance: '1504 MLD' },
  { id: 'account2', name: 'MLD', balance: '1504 MLD' },
  { id: 'account3', name: 'MLD', balance: '1504 MLD' },
  { id: 'account4', name: 'MLD', balance: '1504 MLD' },
];

const SELECT_ASSETS = [
  { id: 'asset1', name: 'Melody' },
  { id: 'asset2', name: 'Melody' },
  { id: 'asset3', name: 'Melody' },
  { id: 'asset4', name: 'Melody' },
];

const avatarUrl = chrome?.runtime?.getURL('avatar.png');

export const Send = () => (
  <div className="h-full pt-5 px-4">
    <div className="flex justify-between items-center w-full">
      <NavLink
        to={ROUTES.APP.ROOT}
        className="flex items-center justify-center max-w-5 max-h-5 p-0.5"
      >
        <ArrowLeft className="w-full h-full text-white" />
      </NavLink>
      <h1 className="text-h5 text-white font-bold">Send</h1>
      <div className="max-w-5 w-full max-h-5" />
    </div>
    <div className="p-4 border rounded-xl border-neutral-2 mt-5">
      <Input variant="primary" placeholder="Address" icon={<QRCode width={20} />} />
      <div className="flex flex-col w-full mt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-neutral-1">Account 1</label>
          <Select defaultValue="account1">
            <SelectTrigger className="max-w-56 py-2.5">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              {SELECT_ACCOUNT.map((account, index, array) => (
                <Fragment key={account.id}>
                  <SelectItem value={account.id}>
                    <div className="flex items-center text-left">
                      <img className="w-7 h-7 rounded-full" src={avatarUrl} alt="avatar" />
                      <div className="ml-1.5">
                        <p className="text-sm">{account.name}</p>
                        <p className="text-xs text-neutral-1">Balance: {account.balance}</p>
                      </div>
                    </div>
                  </SelectItem>
                  {index + 1 !== array.length && <SelectSeparator />}
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm text-neutral-1">Asset</label>
          <Select defaultValue="asset1">
            <SelectTrigger className="max-w-56 py-2.5">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent>
              {SELECT_ASSETS.map((asset, index, array) => (
                <Fragment key={asset.id}>
                  <SelectItem value={asset.id}>
                    <div className="flex items-center text-left">
                      <div className="rounded-full w-7 h-7 bg-neutral-2 p-2 flex items-center justify-center">
                        <LogoIcon />
                      </div>
                      <div className="flex flex-col ml-3">
                        <p className="text-base text-white">{asset.name}</p>
                      </div>
                    </div>
                  </SelectItem>
                  {index + 1 !== array.length && <SelectSeparator />}
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm text-neutral-1">Amount</label>
          <Input
            value="1000 MLD"
            className={cn(
              'p-2.5 bg-neutral-2 text-white border border-neutral-2 rounded-md max-w-56 w-full h-10',
              'hover:border-neutral-1',
              'focus:outline-0 focus:border-blue focus:text-white',
            )}
          />
        </div>
      </div>
      <div className="flex justify-between items-center text-blue text-sm font-bold mt-5">
        <p>Fee</p>
        <p>0.0004 MLD</p>
      </div>
      <div className="mt-8">
        <Button className="w-full">Send</Button>
      </div>
    </div>
  </div>
);
