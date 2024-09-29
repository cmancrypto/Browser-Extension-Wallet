import { NavLink } from 'react-router-dom';
import { AssetScroller, ReceiveDialog } from '@/components';
import { ROUTES } from '@/constants';
import { Button } from '@/ui-kit';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';

export const Main = () => {
  const walletState = useAtomValue(walletStateAtom);

  return (
    <div className="h-full">
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
        {walletState.address ? (
          <AssetScroller />
        ) : (
          <p className="text-base text-neutral-1">No available assets</p>
        )}
      </div>
    </div>
  );
};
