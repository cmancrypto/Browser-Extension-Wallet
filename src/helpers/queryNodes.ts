import { CHAIN_NODES, DELAY_BETWEEN_NODE_ATTEMPTS, MAX_NODES_PER_QUERY } from '@/constants';
import { getNodeErrorCounts, storeNodeErrorCounts } from './localStorage';

// TODO: move to its own time-based helpers file
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Select and prioritize node providers based on their error counts
const selectNodeProviders = () => {
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
const incrementErrorCount = (nodeProvider: string): void => {
  const errorCounts = getNodeErrorCounts();
  errorCounts[nodeProvider] = (errorCounts[nodeProvider] || 0) + 1;
  storeNodeErrorCounts(errorCounts);
};

// Function to query the node with retries and delay
export const queryNode = async (endpoint: string, queryBody: string = ''): Promise<any> => {
  const providers = selectNodeProviders();
  let numberAttempts = 0;

  while (numberAttempts < MAX_NODES_PER_QUERY) {
    for (const provider of providers) {
      try {
        const response = await fetch(`${provider.rest}${endpoint}`, {
          method: 'POST',
          body: queryBody || null,
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          // TODO: show error to user
          throw new Error('Node query failed');
        }

        // Return successful result
        return await response.json();
      } catch (error) {
        incrementErrorCount(provider.rpc);
      }
      // Increment the attempt count
      numberAttempts++;

      if (numberAttempts >= MAX_NODES_PER_QUERY) {
        break;
      }

      // Wait for 1 second before trying the next provider
      await delay(DELAY_BETWEEN_NODE_ATTEMPTS);
    }
  }

  // Throw an error if all attempts fail after trying all nodes
  throw new Error(`All node query attempts failed after ${MAX_NODES_PER_QUERY} attempts.`);
};
