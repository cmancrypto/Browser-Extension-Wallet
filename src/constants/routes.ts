const APP_ROOT = '/';
const AUTH_ROOT = '/auth';

export const ROUTES = {
  APP: {
    ROOT: APP_ROOT,
    TRANSACTIONS_HISTORY: `/history`,
    TRANSACTION: `/history/:id`,
    SEND: '/send',
    RECEIVE: '/send',
    ADD_NETWORK: '/add-network',
  },
  AUTH: {
    ROOT: AUTH_ROOT,
    CREATE_WALLET: `${AUTH_ROOT}/create-wallet`,
    IMPORT_WALLET: `${AUTH_ROOT}/import-wallet`,
  },
};
