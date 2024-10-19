import React from 'react';
import { Button, SlideTray } from '@/ui-kit';
import { TileScroller } from '../TileScroller';
import { LogoIcon } from '@/assets/icons';
import { Asset } from '@/types';

interface AssetSelectDialogProps {
  selectedAsset: Asset | null;
  isSendDialog?: boolean;
  onClick: (asset: Asset) => void;
}

export const AssetSelectDialog: React.FC<AssetSelectDialogProps> = ({
  selectedAsset,
  isSendDialog = false,
  onClick,
}) => {
  return (
    <SlideTray
      triggerComponent={
        <div className="rounded-full h-7 w-7 bg-neutral-2 p-1 flex items-center justify-center hover:bg-blue-hover hover:text-blue-dark cursor-pointer">
          {selectedAsset && selectedAsset.logo ? (
            <img src={selectedAsset.logo} alt={selectedAsset.symbol || 'Unknown Asset'} />
          ) : (
            <LogoIcon />
          )}
        </div>
      }
      title={isSendDialog ? 'Send' : 'Receive'}
      showBottomBorder
    >
      <div className="flex flex-col items-center space-y-2">
        {/* Flex container for Tap to Select and Selected on the same line */}
        <div className="flex justify-between items-center w-full px-2">
          <div className="text-sm">Tap to select</div>
          <div className="text-sm">
            Selected: <span className="text-blue">{selectedAsset?.symbol || 'None'}</span>
          </div>
        </div>

        <div className="relative w-full">
          {/* TODO: reduce to 13 REM if bottom border goes back in, consider border-neutral-4 */}
          {/* QR Code Display */}
          <div className="flex-grow w-full max-h-[13.5rem] overflow-y-auto border border-gray-300 rounded-md">
            {/* TODO: within tilescroller, ensure overflow over halfway results in ellipses.  they can click in for more information if needed */}
            <TileScroller
              activeIndex={0}
              displayWalletAssets={isSendDialog}
              isSelectable={true}
              addMargin={false}
              onSelectAsset={onClick}
            />
          </div>
        </div>

        {/* Confirm button */}
        <div className="w-full mt-2">
          <Button className="w-full">Confirm</Button>
        </div>
      </div>
    </SlideTray>
  );
};
