import React from 'react';
import { Button, SlideTray } from '@/ui-kit';
import { Sort } from '@/assets/icons';
import { useAtom } from 'jotai';
import {
  assetSortOrderAtom,
  assetSortTypeAtom,
  validatorSortOrderAtom,
  validatorSortTypeAtom,
} from '@/atoms';

interface SortDialogProps {
  isValidatorSort?: boolean;
}

export const SortDialog: React.FC<SortDialogProps> = ({ isValidatorSort = false }) => {
  const [assetSortOrder, setAssetSortOrder] = useAtom(assetSortOrderAtom);
  const [validatorSortOrder, setValidatorSortOrder] = useAtom(validatorSortOrderAtom);
  const [assetSortType, setAssetSortType] = useAtom(assetSortTypeAtom);
  const [validatorSortType, setValidatorSortType] = useAtom(validatorSortTypeAtom);

  const sortOptions = isValidatorSort
    ? ['name', 'delegation', 'rewards', 'apr', 'votingPower']
    : ['name', 'amount'];

  const setSortOrder = (sortOrder: 'Asc' | 'Desc') => {
    isValidatorSort ? setValidatorSortOrder(sortOrder) : setAssetSortOrder(sortOrder);
  };

  const setSortType = (sortType: string) => {
    isValidatorSort ? setValidatorSortType(sortType as any) : setAssetSortType(sortType as any);
  };

  const resetDefaults = () => {
    isValidatorSort ? setValidatorSortOrder('Desc') : setAssetSortOrder('Desc');
    isValidatorSort ? setValidatorSortType('name') : setAssetSortType('name');
  };

  const sortOrder = isValidatorSort ? validatorSortOrder : assetSortOrder;
  const sortType = isValidatorSort ? validatorSortType : assetSortType;

  return (
    <SlideTray
      triggerComponent={
        <Button
          className="rounded-full bg-transparent text-neutral-1 p-[7px] hover:bg-blue-hover-secondary hover:text-blue-dark active:bg-blue-pressed-secondary active:text-black"
          size="rounded-default"
        >
          <Sort width={20} className="text-white" />
        </Button>
      }
      title={'Sort Options'}
      showBottomBorder
      height="45%"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-full">
          {/* Sort Order Selection */}
          <div className="flex justify-between items-center p-2">
            <div className="flex-1 text-sm">Order:</div>
            <div className="flex items-center">
              <Button
                variant={sortOrder === 'Asc' ? 'selected' : 'unselected'}
                size="xsmall"
                className="px-1 rounded-md text-xs"
                onClick={() => setSortOrder('Asc')}
              >
                Asc
              </Button>
              <p className="text-sm px-1">/</p>
              <Button
                variant={sortOrder === 'Desc' ? 'selected' : 'unselected'}
                size="xsmall"
                className="px-1 rounded-md text-xs"
                onClick={() => setSortOrder('Desc')}
              >
                Desc
              </Button>
            </div>
          </div>

          {/* Sort Type Selection */}
          <div className="flex justify-between items-center p-2">
            <div className="flex-1 text-sm">Sort by:</div>
            <div className="flex items-center">
              {sortOptions.map(option => (
                <React.Fragment key={option}>
                  <Button
                    variant={sortType === option ? 'selected' : 'unselected'}
                    size="xsmall"
                    className="px-1 rounded-md text-xs"
                    onClick={() => setSortType(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                  {option !== sortOptions[sortOptions.length - 1] && (
                    <p className="text-sm px-1">/</p>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center p-2">
            <Button
              variant="unselected"
              size="xsmall"
              className="px-1 rounded-md text-xs"
              onClick={resetDefaults}
            >
              Reset Defaults
            </Button>
          </div>
        </div>
      </div>
    </SlideTray>
  );
};
