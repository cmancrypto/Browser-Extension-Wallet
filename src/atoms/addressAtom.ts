import { atom } from 'jotai';

export const recipientAddressAtom = atom<string>('');
export const addressVerifiedAtom = atom<boolean>(false);
