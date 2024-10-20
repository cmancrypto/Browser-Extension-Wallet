import { atom } from 'jotai';

// Define the types of updates
export type ChangeType = 'sendAsset' | 'receiveAsset' | 'sendAmount' | 'receiveAmount';

// Use a map to track updates
export const changeMapAtom = atom<Record<ChangeType, boolean>>({
  sendAsset: false,
  receiveAsset: false,
  sendAmount: false,
  receiveAmount: false,
});

export const callbackChangeMapAtom = atom<Record<ChangeType, boolean>>({
  sendAsset: false,
  receiveAsset: false,
  sendAmount: false,
  receiveAmount: false,
});
