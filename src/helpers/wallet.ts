import { Secp256k1HdWallet } from '@cosmjs/amino';
import { encryptMnemonic } from './crypto';
import { storePasswordHash } from './auth';
import { NETWORK, WALLET_PREFIX } from '@/constants';
import { storeAccessToken, storeMnemonic } from './localStorage';

/**
 * Create a wallet using Secp256k1HdWallet and store encrypted mnemonic and password hash.
 * @param mnemonic The mnemonic string (12 or 24 words).
 * @param password The password for the wallet.
 * @param use24Words Whether to use 24-word mnemonic.
 * @returns An object containing the wallet address and network.
 */
export const createWallet = async (
  mnemonic: string,
  password: string,
): Promise<{ walletAddress: string; network: string }> => {
  // Create wallet from mnemonic
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: WALLET_PREFIX,
  });

  // Get wallet address
  const [{ address }] = await wallet.getAccounts();

  // Store hashed password in localStorage
  storePasswordHash(password);

  // Encrypt the mnemonic using the password and store it
  const encryptedMnemonic = encryptMnemonic(mnemonic, password);
  storeMnemonic(encryptedMnemonic);

  // Return wallet information
  return {
    walletAddress: address,
    network: NETWORK,
  };
};

/**
 * Retrieves the wallet address by decrypting the mnemonic with the provided password.
 * @param password The password used to decrypt the mnemonic.
 * @returns The wallet address or null if decryption fails.
 */
export const getWalletAddress = async (mnemonic: string): Promise<string> => {
  // Create the wallet and retrieve the address
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: WALLET_PREFIX });
  const [{ address }] = await wallet.getAccounts();

  return address;
};

/**
 * Generate a token containing non-sensitive wallet information.
 * @param walletAddress The public wallet address.
 * @returns The generated token.
 */
export const generateToken = (walletAddress: string): string => {
  const token = JSON.stringify({
    walletAddress,
    network: NETWORK,
    timestamp: new Date().toISOString(),
  });

  storeAccessToken(token);
  return token;
};
