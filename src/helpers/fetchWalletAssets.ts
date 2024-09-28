import { IBC_PREFIX, RPC_URL, LOCAL_ASSET_REGISTRY, GREATER_EXPONENT_DEFAULT } from '@/constants';
import { Asset } from '@/types';

// Define the shape of WalletState
interface WalletState {
  address: string;
  assets: Asset[];
}

const resolveIbcDenom = async (
  ibcDenom: string,
): Promise<{ denom: string; symbol: string; logo?: string; exponent: number }> => {
  try {
    const denomHash = ibcDenom.slice(4); // Remove the "ibc/" prefix to get the hash
    const response = await fetch(`${RPC_URL}/ibc/apps/transfer/v1/denom_traces/${denomHash}`);
    const data = await response.json();
    const baseDenom = data.denom_trace?.base_denom;

    if (!baseDenom) {
      throw new Error(`Failed to resolve IBC denom: ${ibcDenom}`);
    }

    // Check local registry for base denom information
    const registryAsset = LOCAL_ASSET_REGISTRY[baseDenom] || null;

    let symbol: string;
    let logo: string | undefined;
    let exponent: number;

    if (registryAsset) {
      symbol = registryAsset.symbol ?? baseDenom;
      logo = registryAsset.logo;
      exponent = registryAsset.exponent ?? GREATER_EXPONENT_DEFAULT;
    } else {
      symbol = baseDenom;
      logo = undefined;
      exponent = GREATER_EXPONENT_DEFAULT;
    }

    return { denom: baseDenom, symbol, logo, exponent };
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

// Helper function to adjust the amount by shifting the decimal point
const adjustAmountByExponent = (amount: string, exponent: number): string => {
  const divisor = Math.pow(10, exponent);
  return (parseFloat(amount) / divisor).toFixed(exponent);
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

        // Adjust the coin amount by the exponent (shift decimal)
        const adjustedAmount = adjustAmountByExponent(coin.amount, exponent);

        if (coin.denom.startsWith(IBC_PREFIX)) {
          // Destructure the resolved denom properties
          const {
            denom: resolvedDenom,
            symbol: resolvedSymbol,
            logo: resolvedLogo,
            exponent: resolvedExponent,
          } = await resolveIbcDenom(coin.denom);

          // Adjust the amount based on the resolved exponent
          const resolvedAmount = adjustAmountByExponent(coin.amount, resolvedExponent);

          // Assign the resolved properties and adjusted amount
          return {
            ...coin,
            denom: resolvedDenom,
            symbol: resolvedSymbol,
            logo: resolvedLogo,
            exponent: resolvedExponent,
            amount: resolvedAmount,
          };
        }

        // Return the adjusted asset data
        return { ...coin, symbol, logo, exponent, amount: adjustedAmount };
      }),
    );

    return walletAssets;
  } catch (error) {
    console.error('Error fetching wallet assets:', error);
    return [];
  }
}
