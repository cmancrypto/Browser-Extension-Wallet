import { getLocalStorageItem } from '@/helpers/localStorage';

export const getAccessToken = () => getLocalStorageItem('accessToken');
