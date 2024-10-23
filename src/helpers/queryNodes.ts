import {
  CHAIN_NODES,
  DELAY_BETWEEN_NODE_ATTEMPTS,
  LOCAL_ASSET_REGISTRY,
  MAX_NODES_PER_QUERY,
} from '@/constants';
import { getNodeErrorCounts, getSessionToken, storeNodeErrorCounts } from './localStorage';
import { SigningStargateClient } from '@cosmjs/stargate';
import { createOfflineSignerFromMnemonic } from './wallet';
import { delay } from './timer';
import { RPCResponse } from '@/types';


//indexer specific error - i.e tx submitted, but indexer disabled so returned incorrect 

const isIndexerError = (error: any): boolean => {
  return error?.message?.includes('transaction indexing is disabled') ||
         error?.message?.includes('indexing is disabled');
};

//check the transaction
const isTransactionSuccess = (error: any): boolean => {
  // Check if the error actually contains a successful transaction
  return isIndexerError(error) && 
         error?.message?.includes('code: 0'); // Transaction success code
};


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
): Promise<RPCResponse> => {
  try {
    // TODO: modify to support multi-send
    const fee = {
      amount: [{ denom: feeDenom, amount: '5000' }],
      gas: '200000',
    };

    const result = await client.signAndBroadcast(walletAddress, messages, fee);
    console.log(result)
    // Check if transaction was successful
    if (result.code === 0) {
      return {
        code: 0,
        txHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        gasWanted: result.gasWanted?.toString(),
      };
    }

    throw new Error('Transaction failed');
  } catch (error: any) {
    // Check if it's an indexer error but the transaction was actually successful
    if (error.message?.includes('transaction indexing is disabled')) {
      console.log(error.message)
      // Look for success indicators in the error message
      const includesSuccessCode = error.message.includes('code: 0') || 
                                 error.message.includes('"code":0');
      
      if (includesSuccessCode) {
        // Transaction was successful despite indexer error
        return {
          code: 0,
          message: 'Transaction submitted successfully (indexer disabled)',
          txHash: error.txHash || 'unknown'
        };
      }
    }
    
    // Re-throw all other errors
    throw error;
  }
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
  let lastError: any = null;

  while (numberAttempts < MAX_NODES_PER_QUERY) {
    for (const provider of providers) {
      try {
        const queryMethod = useRPC ? provider.rpc : provider.rest;
        console.log(`Querying node ${queryMethod} with endpoint: ${endpoint}`);

        if (useRPC) {
          const sessionToken = getSessionToken();
          if (!sessionToken) {
            throw new Error('Session token doesnt exist');
          }
          const mnemonic = sessionToken.mnemonic;
          const address = sessionToken.address;
          if (!mnemonic) {
            throw new Error('Wallet is locked or unavailable');
          }

          const offlineSigner = await createOfflineSignerFromMnemonic(mnemonic);
          const client = await SigningStargateClient.connectWithSigner(queryMethod, offlineSigner);

          try {
            const result = await performRpcQuery(client, address, messages, feeDenom);
            return result;
          } catch (rpcError: any) {
            lastError = rpcError;
            
            // If it's an indexer error but transaction was successful
            if (isTransactionSuccess(rpcError)) {
              return {
                code: 0,
                message: 'Transaction submitted successfully (indexer disabled)',
                txHash: rpcError?.txHash || 'unknown',
              };
            }

            // If it's just an indexer error, try next node
            if (isIndexerError(rpcError)) {
              console.warn(`Node ${queryMethod} has indexing disabled, trying next node`);
              continue;
            }

            // For other RPC errors, increment error count and try next node
            incrementErrorCount(provider.rpc);
            throw rpcError;
          }
        }

        // REST Query
        const response = await performRestQuery(endpoint, queryMethod, queryType);
        return response;
      } catch (error) {
        lastError = error;
        console.error('Error querying node:', error);
        
        // Don't increment error count for indexer issues
        if (!isIndexerError(error)) {
          incrementErrorCount(provider.rpc);
        }
      }
      
      numberAttempts++;
      if (numberAttempts >= MAX_NODES_PER_QUERY) {
        break;
      }

      await delay(DELAY_BETWEEN_NODE_ATTEMPTS);
    }
  }

  // If the last error was an indexer error with successful transaction
  if (isTransactionSuccess(lastError)) {
    return {
      code: 0,
      message: 'Transaction submitted successfully (indexer disabled)',
      txHash: lastError?.txHash || 'unknown',
    };
  }

  throw new Error(`All node query attempts failed after ${MAX_NODES_PER_QUERY} attempts. ${lastError?.message || ''}`);
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
