import React from 'react';
import { AssetScrollTile } from '../AssetScrollTile';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';

interface AssetTilesProps {
  isSelectable?: boolean;
}

export const AssetTiles: React.FC<AssetTilesProps> = ({ isSelectable = false }) => {
  const walletState = useAtomValue(walletStateAtom);

  if (!walletState?.assets?.length) {
    return <p className="text-base text-neutral-1 px-4">No assets found</p>;
  }

  return (
    <>
      {walletState.assets.map(asset => (
        <AssetScrollTile key={asset.denom} asset={asset} isSelectable={isSelectable} />
      ))}
    </>
  );
};
