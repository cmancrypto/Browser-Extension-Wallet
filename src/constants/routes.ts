const AUTH_ROOT = '/auth';

export const ROUTES = {
  APP: {
    ROOT: '/',
  },
  AUTH: {
    ROOT: AUTH_ROOT,
    CREATE_WALLET: `${AUTH_ROOT}/create-wallet`,
    IMPORT_WALLET: `${AUTH_ROOT}/import-wallet`,
  },
};
