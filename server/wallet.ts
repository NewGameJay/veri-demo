/**
 * Web3 Wallet Service
 * Handles custodial wallet creation and management for Veri users
 */

import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { db } from './db.ts';
import { users } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

// Encryption key - in production, this should be from environment variables
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || 'veri-wallet-encryption-key-2025';

/**
 * Generate a unique Veri Account ID
 * Format: VERI-XXXXXXXX (8 random alphanumeric characters)
 */
function generateVeriAccountId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'VERI-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Encrypt private key using AES encryption
 */
function encryptPrivateKey(privateKey: string): string {
  return CryptoJS.AES.encrypt(privateKey, ENCRYPTION_KEY).toString();
}

/**
 * Decrypt private key (server-side only, never expose to client)
 */
function decryptPrivateKey(encryptedKey: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Create a new custodial wallet for a user
 */
export async function createWalletForUser(userId: number): Promise<{
  veriAccountId: string;
  walletAddress: string;
  success: boolean;
  error?: string;
}> {
  try {
    // Check if user already has a wallet
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!existingUser.length) {
      return { veriAccountId: '', walletAddress: '', success: false, error: 'User not found' };
    }

    if (existingUser[0].walletAddress) {
      return { 
        veriAccountId: existingUser[0].veriAccountId || '', 
        walletAddress: existingUser[0].walletAddress, 
        success: true 
      };
    }

    // Generate new wallet
    const wallet = ethers.Wallet.createRandom();
    const veriAccountId = generateVeriAccountId();
    
    // Encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

    // Update user with wallet information
    await db.update(users)
      .set({
        veriAccountId,
        walletAddress: wallet.address,
        encryptedPrivateKey,
        walletCreatedAt: new Date(),
        chainId: 137, // Polygon
      })
      .where(eq(users.id, userId));

    console.log(`Created wallet for user ${userId}: ${wallet.address}`);

    return {
      veriAccountId,
      walletAddress: wallet.address,
      success: true
    };

  } catch (error) {
    console.error('Error creating wallet:', error);
    return { veriAccountId: '', walletAddress: '', success: false, error: 'Failed to create wallet' };
  }
}

/**
 * Get wallet information for a user (public data only)
 */
export async function getUserWalletInfo(userId: number): Promise<{
  veriAccountId: string | null;
  walletAddress: string | null;
  chainId: number | null;
  walletCreatedAt: Date | null;
  hasWallet: boolean;
}> {
  try {
    const user = await db.select({
      veriAccountId: users.veriAccountId,
      walletAddress: users.walletAddress,
      chainId: users.chainId,
      walletCreatedAt: users.walletCreatedAt,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length) {
      return { veriAccountId: null, walletAddress: null, chainId: null, walletCreatedAt: null, hasWallet: false };
    }

    const userData = user[0];
    return {
      veriAccountId: userData.veriAccountId,
      walletAddress: userData.walletAddress,
      chainId: userData.chainId,
      walletCreatedAt: userData.walletCreatedAt,
      hasWallet: !!userData.walletAddress
    };

  } catch (error) {
    console.error('Error getting wallet info:', error);
    return { veriAccountId: null, walletAddress: null, chainId: null, walletCreatedAt: null, hasWallet: false };
  }
}

/**
 * Get wallet balance (placeholder for future implementation)
 */
export async function getWalletBalance(walletAddress: string): Promise<{
  balance: string;
  tokens: Array<{ symbol: string; balance: string; usdValue: string }>;
}> {
  // Placeholder implementation - in production, this would connect to blockchain
  return {
    balance: '0.0',
    tokens: [
      { symbol: 'VERI', balance: '0.0', usdValue: '$0.00' },
      { symbol: 'MATIC', balance: '0.0', usdValue: '$0.00' }
    ]
  };
}

/**
 * Format wallet address for display (truncated)
 */
export function formatWalletAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * SECURITY NOTICE:
 * - Private keys are encrypted using AES and stored server-side only
 * - Never expose private keys to client-side code
 * - All wallet operations should go through secure server endpoints
 * - Consider hardware security modules (HSM) for production deployment
 */