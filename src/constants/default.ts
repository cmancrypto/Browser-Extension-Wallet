// constants/defaultValues.ts
import { Asset } from '@/types';

// Network-related constants
export const NETWORK = 'symphony';
export const WALLET_PREFIX = 'symphony1';

// RPC and REST URLs for the Symphony network
export const RPC_URL = 'https://symphony-api.kleomedes.network';
export const DEFAULT_CHAIN_NAME = 'symphonytestnet';

// IBC-related constants
export const IBC_PREFIX = 'ibc/';
export const LESSER_EXPONENT_DEFAULT = 0;
export const GREATER_EXPONENT_DEFAULT = 6;

// Endpoints for different network operations
export const CHAIN_ENDPOINT = {
  symphonytestnet: {
    rpc: ['https://symphony-rpc.kleomedes.network'],
    rest: ['https://symphony-api.kleomedes.network'],
  },
};

// Time constants
const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minutes in milliseconds

export const INACTIVITY_TIMEOUT = FIFTEEN_MINUTES;
export const TOKEN_EXPIRATION_TIME = FIFTEEN_MINUTES;
export const DATA_FRESHNESS_TIMEOUT = 15 * 1000; // Data is considered fresh for 15 seconds

// Define the shape of the local asset registry
type AssetRegistry = {
  [key: string]: Asset;
};

// Asset registry for the Symphony network
export const LOCAL_ASSET_REGISTRY: AssetRegistry = {
  uusd: {
    denom: 'uusd',
    amount: '10',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/symphonytestnet/images/husd.png',
    symbol: 'HUSD',
    exponent: GREATER_EXPONENT_DEFAULT,
  },
  ukhd: {
    denom: 'ukhd',
    amount: '1.282',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/symphonytestnet/images/hhkd.png',
    symbol: 'HHKD',
    exponent: GREATER_EXPONENT_DEFAULT,
  },
  uvnd: {
    denom: 'uvnd',
    amount: '0.000399',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/symphonytestnet/images/hvnd.png',
    symbol: 'HVND',
    exponent: GREATER_EXPONENT_DEFAULT,
  },
  note: {
    denom: 'note',
    amount: '1',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/symphonytestnet/images/mld.png',
    symbol: 'MLD',
    exponent: GREATER_EXPONENT_DEFAULT,
  },
  ustars: {
    denom: 'stars',
    amount: '1',
    isIbc: true,
    logo: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/stargaze/ustars.png',
    symbol: 'STARS',
    exponent: GREATER_EXPONENT_DEFAULT,
  },
  uosmo: {
    denom: 'osmo',
    amount: '1',
    isIbc: true,
    logo: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/uosmo.png',
    symbol: 'OSMO',
    exponent: GREATER_EXPONENT_DEFAULT,
  },
};
