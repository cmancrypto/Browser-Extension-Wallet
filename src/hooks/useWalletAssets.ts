import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { IBCPrefix, rpcUrl, localAssetRegistry, greaterExponentDefault } from '@/constants';
import { useAsset } from './useAsset';
import { useAtom } from 'jotai'; // For using atoms
import { walletStateAtom } from '@/atoms';
import { Asset } from '@/types';

// Function to resolve IBC denom
const resolveIbcDenom = async (ibcDenom: string): Promise<string> => {
  try {
    const denomHash = ibcDenom.slice(4); // Remove the "ibc/" prefix
    console.log('Resolving IBC Denom:', ibcDenom);
    const response = await fetch(`${rpcUrl}/ibc/apps/transfer/v1/denom_traces/${denomHash}`);
    const data = await response.json();
    const baseDenom = data.denom_trace?.base_denom;
    if (!baseDenom) {
      throw new Error(`Failed to resolve IBC denom: ${ibcDenom}`);
    }
    console.log('Resolved IBC Denom:', baseDenom);
    return baseDenom;
  } catch (error) {
    console.error(`Error resolving IBC denom ${ibcDenom}:`, error);
    throw error;
  }
};

// Function to manually connect to the Cosmos LCD endpoint and get balances
const getBalances = async (walletAddress: string) => {
  console.log('Fetching balances for wallet address:', walletAddress);

  // Use the Cosmos SDK REST API endpoint to get the balances
  const response = await fetch(`${rpcUrl}/cosmos/bank/v1beta1/balances/${walletAddress}`);
  const data = await response.json();

  if (!response.ok || !data.balances) {
    throw new Error(`Failed to fetch balances for address: ${walletAddress}`);
  }

  console.log('Fetched Balances:', data.balances);
  return data.balances;
};

export function useWalletAssets() {
  const [walletState] = useAtom(walletStateAtom);
  const { address: walletAddress } = walletState;

  const { find } = useAsset();

  console.log('Wallet Address:', walletAddress);

  // Return defaults when no walletAddress is available
  if (!walletAddress) {
    console.log('No wallet address found');
    return {
      isLoading: false,
      error: null,
      data: { assets: [] },
      refetch: () => {},
    };
  }

  const assetsQuery = useQuery({
    queryKey: ['walletAssets', walletAddress],
    queryFn: async () => {
      console.log('Fetching assets for wallet address:', walletAddress);
      const coins = await getBalances(walletAddress);
      return coins.map((coin: Asset) => {
        console.log('Processing Coin:', coin);
        let symbol: string;
        let logo: string | undefined;
        let exponent: number;

        const registryAsset = find(coin.denom);
        if (!registryAsset) {
          console.log('Coin not found in registry:', coin.denom);
          symbol =
            localAssetRegistry[coin.denom as keyof typeof localAssetRegistry]?.symbol ?? coin.denom;
          exponent =
            localAssetRegistry[coin.denom as keyof typeof localAssetRegistry]?.exponent ??
            greaterExponentDefault;
          logo = localAssetRegistry[coin.denom as keyof typeof localAssetRegistry]?.logo;
        } else {
          console.log('Coin found in registry:', registryAsset);
          symbol = registryAsset?.symbol ?? coin.denom;
          exponent = registryAsset?.exponent ?? greaterExponentDefault;
          logo = registryAsset.logo;
        }

        return {
          symbol: symbol ?? coin.denom,
          exponent: exponent ?? greaterExponentDefault,
          denom: coin.denom,
          amount: coin.amount,
          isIbc: coin.denom.startsWith(IBCPrefix),
          logo,
        };
      });
    },
    enabled: !!walletAddress,
  });

  const walletAssets = useMemo(() => assetsQuery.data, [assetsQuery.data]);

  const resolvedAddressesQuery = useQuery({
    queryKey: ['resolvedAddresses', walletAssets],
    queryFn: async () => {
      console.log('Resolving IBC addresses for assets');
      const resolvedAssets = await Promise.all(
        walletAssets!.map(async (asset: Asset) => {
          if (asset.isIbc) {
            const resolvedDenom = await resolveIbcDenom(asset.denom);
            return { ...asset, denom: resolvedDenom };
          }
          return asset;
        }),
      );
      console.log('Resolved Assets:', resolvedAssets);
      return resolvedAssets;
    },
    enabled: !!walletAssets,
  });

  const allQueries = {
    assets: assetsQuery,
    resolvedAddresses: resolvedAddressesQuery,
  };

  const isInitialFetching = Object.values(allQueries).some(({ isLoading }) => isLoading);
  const isDoingRefetching = Object.values(allQueries).some(({ isRefetching }) => isRefetching);

  const isLoading = isInitialFetching || isDoingRefetching;

  const data = useMemo(() => {
    if (isLoading) {
      console.log('Fetching or Refetching in progress');
      return;
    }
    console.log('All Queries Data:', allQueries);
    return Object.fromEntries(Object.entries(allQueries).map(([key, query]) => [key, query.data]));
  }, [allQueries, isLoading]);

  const refetch = () => {
    console.log('Refetching assets and resolved addresses');
    assetsQuery.refetch();
    resolvedAddressesQuery.refetch();
  };

  return {
    isLoading,
    error: assetsQuery.error || resolvedAddressesQuery.error,
    data,
    refetch,
  };
}
