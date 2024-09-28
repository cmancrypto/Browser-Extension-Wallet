import { Asset } from '@/types';
import { localAssetRegistry } from '@/constants';

export const useAsset = () => {
  const find = (denom: string): Asset | undefined => {
    return localAssetRegistry[denom as keyof typeof localAssetRegistry];
  };

  return { find };
};
