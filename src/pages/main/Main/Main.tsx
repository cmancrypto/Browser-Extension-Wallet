import { Select, SelectValue } from '@radix-ui/react-select';
import { NavLink } from 'react-router-dom';
import { LogoIcon } from '@/assets/icons';
import { ReceiveDialog } from '@/components';
import { DATA_FRESHNESS_TIMEOUT, ROUTES } from '@/constants';
import {
  Button,
  ScrollArea,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from '@/ui-kit';
import { useWalletAssets } from '@/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { Asset, WalletAssets } from '@/types';
import { walletStateAtom } from '@/atoms';

export const Main = () => {
  const { data, refetch } = useWalletAssets();

  const [walletState, setWalletState] = useAtom(walletStateAtom);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const memoizedAssets = useMemo(() => {
    return data?.assets || [];
  }, [data?.assets]);

  useEffect(() => {
    if (memoizedAssets.length > 0) {
      console.log('Updating Wallet State with assets:', memoizedAssets);
      setWalletState((prevState: WalletAssets) => ({
        ...prevState,
        assets: memoizedAssets,
      }));
    }

    // Clear any existing timer before setting a new one
    if (timer) clearInterval(timer);

    // Set the timer to refetch the data after the DATA_FRESHNESS_TIMEOUT
    const expirationTimer = setInterval(() => {
      console.log('Data expired, refetching...');
      refetch();
    }, DATA_FRESHNESS_TIMEOUT);

    setTimer(expirationTimer);

    // Cleanup the interval when the component unmounts or memoizedAssets change
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [memoizedAssets]);

  console.log('Rendering Wallet State:', walletState);

  return (
    <div className="h-full pt-5">
      <div className="flex gap-x-6 px-4">
        <div className="text-left">
          <label className="text-sm text-neutral-1">Account 1</label>
          <Select defaultValue="1ZChms...HVDzw">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1ZChms...HVDzw">1ZChms...HVDzw</SelectItem>
              <SelectSeparator />
              <SelectItem value="1ZChms...HbHe1">1ZChms...HbHe1</SelectItem>
              <SelectSeparator />
              <SelectItem value="1ZChms...H24Kvh">1ZChms...H24Kvh</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-left">
          <label className="text-sm text-neutral-1 mb-0.5">Network</label>
          <Select defaultValue="symphony">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symphony">Symphony</SelectItem>
              <SelectSeparator />
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectSeparator />
              <NavLink
                to={ROUTES.APP.ADD_NETWORK}
                className="flex text-blue font-normal hover:text-blue-dark py-2 px-2.5 focus:outline-0"
              >
                Add new network
              </NavLink>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="px-4 mt-4">
        <div className="p-4 border rounded-xl border-neutral-4 flex flex-col items-center">
          <div className="text-center mb-7">
            <p className="text-base text-neutral-1">Available balance</p>
            <h1 className="text-h2 text-white font-bold">$1504.94</h1>
          </div>
          <div className="grid grid-cols-2 w-full gap-x-4 px-2">
            <ReceiveDialog />
            <Button className="w-full" asChild>
              <NavLink to={ROUTES.APP.SEND}>Send</NavLink>
            </Button>
          </div>
        </div>
      </div>
      <div className="text-left pt-4">
        <h3 className="text-h4 text-white font-bold px-4">Assets</h3>
        <ScrollArea
          className="h-[200px] w-full mt-3"
          type="always"
          scrollbarProps={{
            className: 'max-h-[93%]',
          }}
        >
          {walletState.assets.map((asset: Asset) => (
            <div
              key={asset.symbol}
              className="mx-4 py-2 min-h-[52px] flex items-center not-last:border-b not-last:border-neutral-4"
            >
              <div className="rounded-full h-9 w-9 bg-neutral-2 p-2 flex items-center justify-center">
                <LogoIcon />
              </div>
              <div className="flex flex-col ml-3">
                <h6 className="text-base text-white">{asset.symbol}</h6>
                <p className="text-xs text-neutral-1">{`${asset.amount} ${asset.symbol}`}</p>
              </div>
              <div className="flex-1" />
              <div className="text-white text-h6">$1504.94</div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};
