import {
  CHAIN_NODES,
  DELAY_BETWEEN_NODE_ATTEMPTS,
  LOCAL_ASSET_REGISTRY,
  MAX_NODES_PER_QUERY,
} from '@/constants';
import { getNodeErrorCounts, storeNodeErrorCounts } from './localStorage';
import { SigningStargateClient } from '@cosmjs/stargate';
import { getSessionWallet } from './sessionStorage';
import { createOfflineSignerFromMnemonic } from './wallet';
import { delay } from './timer';

// Select and prioritize node providers based on their error counts
export const selectNodeProviders = () => {
  const errorCounts = getNodeErrorCounts();

  // Get node providers and their respective error counts
  const providers = CHAIN_NODES.symphonytestnet.map(provider => ({
    ...provider,
    failCount: errorCounts[provider.rpc] || 0,
  }));

  // Sort providers based on failCount, with lower fail counts first
  return providers.sort((a, b) => a.failCount - b.failCount);
};

// Increment the error count for a specific provider
export const incrementErrorCount = (nodeProvider: string): void => {
  const errorCounts = getNodeErrorCounts();
  errorCounts[nodeProvider] = (errorCounts[nodeProvider] || 0) + 1;
  storeNodeErrorCounts(errorCounts);
};

// Helper: Perform a REST API query to a selected node
const performRestQuery = async (
  endpoint: string,
  queryMethod: string,
  queryType: 'POST' | 'GET',
) => {
  const response = await fetch(`${queryMethod}${endpoint}`, {
    method: queryType,
    body: null,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Node query failed');
  }

  return await response.json();
};

// Helper: Perform an RPC query using signing, such as for claiming rewards or staking
export const performRpcQuery = async (
  client: SigningStargateClient,
  walletAddress: string,
  messages: any[],
  feeDenom: string,
) => {
  // TODO: modify to support multi-send
  const fee = {
    amount: [{ denom: feeDenom, amount: '5000' }],
    gas: '200000',
  };

  return await client.signAndBroadcast(walletAddress, messages, fee);
};

// Function to query the node with retries and delay
const queryWithRetry = async ({
  endpoint,
  useRPC = false,
  queryType = 'GET',
  messages = [],
  feeDenom,
}: {
  endpoint: string;
  useRPC?: boolean;
  queryType?: 'GET' | 'POST';
  messages?: any[];
  feeDenom: string;
}): Promise<any> => {
  const providers = selectNodeProviders();
  console.log('Selected node providers:', providers);

  let numberAttempts = 0;

  while (numberAttempts < MAX_NODES_PER_QUERY) {
    for (const provider of providers) {
      try {
        const queryMethod = useRPC ? provider.rpc : provider.rest;
        console.log(`Querying node ${queryMethod} with endpoint: ${endpoint}`);

        console.log(`use rpc: ${useRPC}`);
        if (useRPC) {
          const wallet = await getSessionWallet();
          if (!wallet) {
            console.error('Wallet is locked or unavailable');
            return;
          }

          const offlineSigner = await createOfflineSignerFromMnemonic(wallet?.mnemonic || '');
          const client = await SigningStargateClient.connectWithSigner(queryMethod, offlineSigner);

          const [{ address }] = await wallet.getAccounts();
          const result = await performRpcQuery(client, address, messages, feeDenom);
          return result;
        }

        // REST Query
        const response = await performRestQuery(endpoint, queryMethod, queryType);
        return response;
      } catch (error) {
        incrementErrorCount(provider.rpc);
        console.error('Error querying node:', error);
      }
      numberAttempts++;

      if (numberAttempts >= MAX_NODES_PER_QUERY) {
        break;
      }

      await delay(DELAY_BETWEEN_NODE_ATTEMPTS);
    }
  }

  throw new Error(`All node query attempts failed after ${MAX_NODES_PER_QUERY} attempts.`);
};

// REST query function
export const queryRestNode = async ({
  endpoint,
  queryType = 'GET',
  feeDenom = LOCAL_ASSET_REGISTRY.note.denom,
}: {
  endpoint: string;
  queryType?: 'GET' | 'POST';
  feeDenom?: string;
}): Promise<any> => {
  return await queryWithRetry({
    endpoint,
    useRPC: false,
    queryType,
    feeDenom,
  });
};

// RPC query function
export const queryRpcNode = async ({
  endpoint,
  messages,
  feeDenom = LOCAL_ASSET_REGISTRY.note.denom,
}: {
  endpoint: string;
  messages?: any[];
  feeDenom?: string;
}): Promise<any> => {
  return await queryWithRetry({
    endpoint,
    useRPC: true,
    messages,
    feeDenom,
  });
};
