import React from 'react';
import { AssetScrollTile } from '../AssetScrollTile';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { LOCAL_ASSET_REGISTRY } from '@/constants';
import { Asset } from '@/types';

interface AssetTilesProps {
  displayWalletAssets?: boolean;
  isSelectable?: boolean;
  addMargin?: boolean;
  onClick?: (asset: Asset) => void;
}

export const AssetTiles: React.FC<AssetTilesProps> = ({
  displayWalletAssets = true,
  isSelectable = false,
  addMargin = true,
  onClick,
}) => {
  const walletState = useAtomValue(walletStateAtom);

  const assetList = displayWalletAssets ? walletState.assets : Object.values(LOCAL_ASSET_REGISTRY);

  if (!assetList?.length) {
    return <p className="text-base text-neutral-1 px-4">No assets found</p>;
  }

  return (
    <>
      {/* TODO: asset scroll tile using asset registry needs different values to display.  and/or add titles above columns to say what the value is */}
      {assetList.map(asset => (
        <AssetScrollTile
          key={asset.denom}
          asset={asset}
          isSelectable={isSelectable}
          addMargin={addMargin}
          onClick={onClick}
        />
      ))}
    </>
  );
};
