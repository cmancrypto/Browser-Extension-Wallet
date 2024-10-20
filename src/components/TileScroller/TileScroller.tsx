import React from 'react';
import { ScrollArea } from '@/ui-kit';
import { AssetTiles } from './AssetTiles';
import { ValidatorTiles } from './ValidatorTiles';
import { Asset } from '@/types';

interface TileScrollerProps {
  activeIndex: number;
  displayWalletAssets?: boolean;
  isSelectable?: boolean;
  addMargin?: boolean;
  onSelectAsset?: (asset: Asset) => void;
}

export const TileScroller: React.FC<TileScrollerProps> = ({
  activeIndex,
  displayWalletAssets = true,
  isSelectable = false,
  addMargin = true,
  onSelectAsset,
}) => {
  return (
    <ScrollArea
      className="flex-grow w-full overflow-y-auto"
      type="always"
      scrollbarProps={{ className: 'max-h-[93%]' }}
    >
      {activeIndex === 0 ? (
        <AssetTiles
          displayWalletAssets={displayWalletAssets}
          isSelectable={isSelectable}
          addMargin={addMargin}
          onClick={onSelectAsset}
        />
      ) : (
        <ValidatorTiles isSelectable={isSelectable} addMargin={addMargin} />
      )}
    </ScrollArea>
  );
};
