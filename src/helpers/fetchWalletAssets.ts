import { IBC_PREFIX, RPC_URL, LOCAL_ASSET_REGISTRY, GREATER_EXPONENT_DEFAULT } from '@/constants';
import { Asset } from '@/types';

// Define the shape of WalletState
interface WalletState {
  address: string;
  assets: Asset[];
}

const resolveIbcDenom = async (ibcDenom: string): Promise<string> => {
  try {
    const denomHash = ibcDenom.slice(4);
    const response = await fetch(`${RPC_URL}/ibc/apps/transfer/v1/denom_traces/${denomHash}`);
    const data = await response.json();
    const baseDenom = data.denom_trace?.base_denom;
    if (!baseDenom) {
      throw new Error(`Failed to resolve IBC denom: ${ibcDenom}`);
    }
    return baseDenom;
  } catch (error) {
    console.error(`Error resolving IBC denom ${ibcDenom}:`, error);
    throw error;
  }
};

const getBalances = async (walletAddress: string): Promise<Asset[]> => {
  const response = await fetch(`${RPC_URL}/cosmos/bank/v1beta1/balances/${walletAddress}`);
  const data = await response.json();

  if (!response.ok || !data.balances) {
    throw new Error(`Failed to fetch balances for address: ${walletAddress}`);
  }

  return data.balances;
};

// Function to fetch wallet assets without hooks, without updating the state
export async function fetchWalletAssets(walletState: WalletState): Promise<Asset[]> {
  const { address: walletAddress } = walletState;

  if (!walletAddress) {
    console.error('No wallet address available in walletState!');
    return [];
  }

  try {
    // Fetch balances from the LCD endpoint
    const coins: Asset[] = await getBalances(walletAddress);

    // Map through the balances and resolve their properties
    const walletAssets = await Promise.all(
      coins.map(async (coin: Asset) => {
        let symbol: string;
        let logo: string | undefined;
        let exponent: number;

        const registryAsset = LOCAL_ASSET_REGISTRY[coin.denom] || null;
        if (!registryAsset) {
          symbol = LOCAL_ASSET_REGISTRY[coin.denom]?.symbol ?? coin.denom;
          exponent = LOCAL_ASSET_REGISTRY[coin.denom]?.exponent ?? GREATER_EXPONENT_DEFAULT;
          logo = LOCAL_ASSET_REGISTRY[coin.denom]?.logo;
        } else {
          symbol = registryAsset.symbol ?? coin.denom;
          exponent = registryAsset.exponent ?? GREATER_EXPONENT_DEFAULT;
          logo = registryAsset.logo;
        }

        if (coin.denom.startsWith(IBC_PREFIX)) {
          const resolvedDenom = await resolveIbcDenom(coin.denom);
          return { ...coin, denom: resolvedDenom, symbol, logo, exponent };
        }

        return { ...coin, symbol, logo, exponent };
      }),
    );

    return walletAssets;
  } catch (error) {
    // TODO: return error and display to user
    console.error('Error fetching wallet assets:', error);
    return [];
  }
}
