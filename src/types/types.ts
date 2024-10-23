export interface SessionToken {
  mnemonic: string;
  address: string;
  network: string;
  expiresIn: number;
}

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

export interface SendObject {
  recipientAddress: string;
  amount: string;
  denom: string;
}
export interface SwapObject {
  sendObject: SendObject;
  resultDenom: string;
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
  jailed: boolean;
  status: string; // Bonded, Unbonding, Unbonded
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
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

export interface ValidatorReward {
  validator: string;
  rewards: any[];
}

export interface CombinedStakingInfo {
  delegation: DelegationResponse['delegation'];
  balance: DelegationResponse['balance'];
  validator: ValidatorInfo;
  rewards: ValidatorReward['rewards'];
}

export interface TransactionResult {
  success: boolean;
  message: string;
  data?: any;
}
