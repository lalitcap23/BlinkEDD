// utils/generateBlink.ts
import { PublicKey } from '@solana/web3.js';

export interface BlinkParams {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
}

/**
 * Generate Solana Pay URL (works with all wallets including Phantom, Backpack, etc.)
 * This follows the official Solana Pay specification
 */
export function generateSolanaPayURL(recipient: string, amount: number, label?: string, message?: string): string {
  try {
    // Validate recipient address
    new PublicKey(recipient);
    
    // Create URL parameters - IMPORTANT: amount should be in SOL, not lamports for Solana Pay
    const params = new URLSearchParams();
    params.append('amount', amount.toString()); // Keep as SOL amount
    
    if (label) {
      params.append('label', label);
    }
    
    if (message) {
      params.append('message', message);
    }
    
    // Standard Solana Pay URL format
    return `solana:${recipient}?${params.toString()}`;
  } catch (error) {
    console.error('Error generating Solana Pay URL:', error);
    throw new Error('Invalid recipient address');
  }
}

/**
 * Generate Phantom-specific deep link
 */
export function generatePhantomURL(recipient: string, amount: number, label?: string, message?: string): string {
  try {
    // Validate recipient address
    new PublicKey(recipient);
    
    // Phantom uses a different URL structure
    const params = new URLSearchParams();
    params.append('recipient', recipient);
    params.append('amount', amount.toString()); // SOL amount, not lamports
    
    if (label) {
      params.append('label', label);
    }
    
    if (message) {
      params.append('message', message);
    }
    
    // Phantom deep link format
    return `https://phantom.app/ul/browse/https%3A//phantom.app/ul/v1/transfer?${params.toString()}`;
  } catch (error) {
    console.error('Error generating Phantom URL:', error);
    throw new Error('Invalid recipient address');
  }
}

/**
 * Generate Backpack-compatible URL
 */
export function generateBackpackURL(recipient: string, amount: number, label?: string, message?: string): string {
  // Backpack supports standard Solana Pay URLs
  return generateSolanaPayURL(recipient, amount, label, message);
}

/**
 * Main function - generates the most compatible URL (Solana Pay standard)
 */
export function generateBlinkURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generateSolanaPayURL(recipient, amount, label, message);
}

/**
 * Generate a transfer instruction URL for web-based wallets
 */
export function generateWebWalletURL(recipient: string, amount: number, label?: string): string {
  try {
    new PublicKey(recipient);
    
    const params = new URLSearchParams({
      recipient,
      amount: amount.toString(),
      ...(label && { reference: label })
    });
    
    return `https://solscan.io/tx/new?${params.toString()}`;
  } catch (error) {
    throw new Error('Invalid recipient address');
  }
}

export function validateSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function formatSolAmount(amount: number): string {
  return `${amount} SOL`;
}

// Utility functions for amount conversion (if needed elsewhere)
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}