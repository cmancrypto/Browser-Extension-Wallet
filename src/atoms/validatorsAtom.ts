import { ValidatorInfo, ValidatorReward } from '@/types';
import { atom } from 'jotai';

export const validatorInfoAtom = atom<ValidatorInfo[]>([]);
export const rewardsAtom = atom<ValidatorReward[]>([]);
export const validatorDisplaySelectionAtom = atom<'current' | 'all'>('current');