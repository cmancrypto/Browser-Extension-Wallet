export interface Asset {
  denom: string;
  amount: string;
  isIbc: boolean;
  logo?: string;
  symbol?: string;
  exponent?: number;
}

export interface WalletAssets {
  address: string;
  assets: Asset[];
}

export interface DelegationResponse {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
  };
  balance: {
    denom: string;
    amount: string;
  };
}

export interface Pagination {
  next_key: string | null;
  total: string;
}

export interface ValidatorInfo {
  operator_address: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    details: string;
  };
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
  };
}
