import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { CHAIN_ENDPOINTS } from '@/constants';
import { receiveStateAtom, sendStateAtom } from '@/atoms';
import { queryRestNode } from '@/helpers';

export function useExchangeRate() {
  // Use the combined SendStateAtom and ReceiveStateAtom
  const sendState = useAtomValue(sendStateAtom);
  const receiveState = useAtomValue(receiveStateAtom);

  const sendAsset = sendState.asset?.denom || '';
  const receiveAsset = receiveState.asset?.denom || '';

  const queryExchangeRate = useQuery<string | null, Error, string | null>({
    queryKey: ['exchangeRate', sendAsset, receiveAsset],
    queryFn: async ({ queryKey }): Promise<string | null> => {
      const [, sendAsset, receiveAsset] = queryKey as [string, string, string];
      if (!sendAsset || !receiveAsset) return null;
      if (sendAsset === receiveAsset) {
        return '1';
      }

      // Use queryRestNode to query exchange rates
      const response = await queryRestNode({
        // TODO: no hard values.  get the million from 1 * 10^exponent, defaulting to greater exponent default
        endpoint: `${CHAIN_ENDPOINTS.swap}offerCoin=1000000${sendAsset}&askDenom=${receiveAsset}`,
        queryType: 'GET',
      });

      return response.return_coin?.amount ?? null;
    },
    enabled: !!sendAsset && !!receiveAsset,
    // TODO: be sure this timeout isn't re-triggering after leaving send page.  convert to helper otherwise
    staleTime: 30000, // Consider the data stale after 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const exchangeRate = useMemo(() => {
    if (queryExchangeRate.data) {
      // Use BigNumber for precise decimal arithmetic
      return new BigNumber(queryExchangeRate.data).dividedBy(1000000).toNumber();
    }
    return 0;
  }, [queryExchangeRate.data]);

  return {
    isLoading: queryExchangeRate.isLoading,
    error: queryExchangeRate.error,
    exchangeRate,
  };
}
