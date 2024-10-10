import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs, { strict: false }));
};

export const convertToGreaterUnit = (amount: number, exponent: number): number => {
  return amount / Math.pow(10, exponent);
};
