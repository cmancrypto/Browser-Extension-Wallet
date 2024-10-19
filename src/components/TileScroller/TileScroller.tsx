import React from 'react';
import { ScrollArea } from '@/ui-kit';
import { AssetTiles } from './AssetTiles';
import { ValidatorTiles } from './ValidatorTiles';

interface TileScrollerProps {
  activeIndex: number;
  isSelectable?: boolean;
}

export const TileScroller: React.FC<TileScrollerProps> = ({
  activeIndex,
  isSelectable = false,
}) => {
  return (
    <ScrollArea
      className="flex-grow w-full overflow-y-auto"
      type="always"
      scrollbarProps={{ className: 'max-h-[93%]' }}
    >
      {activeIndex === 0 ? (
        <AssetTiles isSelectable={isSelectable} />
      ) : (
        <ValidatorTiles isSelectable={isSelectable} />
      )}
      <div className="h-4" />
    </ScrollArea>
  );
};
