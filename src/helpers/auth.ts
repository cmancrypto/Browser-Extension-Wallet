import CryptoJS from 'crypto-js';
import { decryptMnemonic } from './crypto';
import { generateToken, getWalletAddress } from './wallet';
import { getStoredMnemonic, getStoredPassword, storePassword } from './localStorage';

/**
 * Hash the password using SHA-512 with a salt (using CryptoJS).
 * @param password The plain text password.
 * @param salt A unique salt for hashing.
 * @returns The hashed password.
 */
const hashPassword = (password: string, salt: string): string => {
  return CryptoJS.SHA512(password + salt).toString(CryptoJS.enc.Hex);
};

/**
 * Store the hashed password and salt in localStorage.
 * @param password The plain text password to hash.
 */
export const storePasswordHash = (password: string): void => {
  const salt = CryptoJS.lib.WordArray.random(16).toString(); // Generate a random salt
  const passwordHash = hashPassword(password, salt);

  // Store both the hash and the salt in localStorage
  storePassword(passwordHash, salt);
};

/**
 * Retrieve the stored hashed password and salt from localStorage.
 * @returns The hashed password and salt, or null if not found.
 */
const getPasswordHash = (): { hash: string; salt: string } | null => {
  const storedHash = getStoredPassword();
  return storedHash;
};

/**
 * Verify the input password by hashing it with the stored salt and comparing it to the stored hash.
 * @param inputPassword The plain text password entered by the user.
 * @returns True if the password is valid, otherwise false.
 */
const verifyPassword = (inputPassword: string): boolean => {
  const storedHash = getPasswordHash();
  if (!storedHash) return false;

  // Hash the input password using the stored salt
  const inputHash = hashPassword(inputPassword, storedHash.salt);

  // Compare the hashed input password to the stored hash
  return inputHash === storedHash.hash;
};

/**
 * Authorizes wallet access, decrypts mnemonic, retrieves wallet address, and saves access token.
 * @param password The password entered by the user.
 * @returns True if authorization was successful, false otherwise.
 */
export const tryAuthorizeWalletAccess = async (password: string): Promise<boolean> => {
  const isVerified = verifyPassword(password);
  if (!isVerified) {
    return false;
  }

  const encryptedMnemonic = getStoredMnemonic();
  if (!encryptedMnemonic) {
    return false;
  }

  try {
    // Decrypt the mnemonic using the provided password
    const mnemonic = decryptMnemonic(encryptedMnemonic, password);

    if (!mnemonic) {
      return false;
    }

    // Create a wallet instance using the mnemonic and await for the result
    const address = await getWalletAddress(mnemonic);

    // Generate and save the access token
    generateToken(address);

    return true; // Successful authorization
  } catch (error) {
    console.error('Authorization failed:', error);
    return false;
  }
};
