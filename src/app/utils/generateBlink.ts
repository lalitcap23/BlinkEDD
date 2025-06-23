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
 * KEEP THIS EXACTLY THE SAME - FOR QR CODES
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
 * Generate proper Solana Action Blink URL (for social media sharing)
 * This creates links that show rich previews and use your API
 */
export function generateActionBlinkURL(baseUrl: string, recipient: string, amount: number, label?: string, message?: string): string {
  try {
    // Validate recipient address
    new PublicKey(recipient);
    
    // Your API action URL with parameters
    const params = new URLSearchParams();
    params.append('recipient', recipient);
    params.append('amount', amount.toString());
    if (label) params.append('label', label);
    if (message) params.append('message', message);
    
    // Your action API endpoint
    const actionUrl = `${baseUrl}/api/action/transfer?${params.toString()}`;
    
    // Proper Blink URL format using dial.to
    return `https://dial.to/?action=solana-action:${encodeURIComponent(actionUrl)}`;
  } catch (error) {
    console.error('Error generating Action Blink URL:', error);
    throw new Error('Invalid recipient address');
  }
}

/**
 * Generate Phantom-specific Blink URL
 */
export function generatePhantomBlinkURL(baseUrl: string, recipient: string, amount: number, label?: string, message?: string): string {
  try {
    new PublicKey(recipient);
    
    const params = new URLSearchParams();
    params.append('recipient', recipient);
    params.append('amount', amount.toString());
    if (label) params.append('label', label);
    if (message) params.append('message', message);
    
    const actionUrl = `${baseUrl}/api/action/transfer?${params.toString()}`;
    
    // Phantom-specific Blink format
    return `https://phantom.app/ul/browse/${encodeURIComponent(actionUrl)}`;
  } catch (error) {
    console.error('Error generating Phantom Blink URL:', error);
    throw new Error('Invalid recipient address');
  }
}

/**
 * BACKWARD COMPATIBILITY - Keep your old function names working
 * These now generate proper Blinks instead of direct payment URLs
 */
export function generateBlinkURL(recipient: string, amount: number, label?: string, message?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return generateActionBlinkURL(baseUrl, recipient, amount, label, message);
}

export function generatePhantomURL(recipient: string, amount: number, label?: string, message?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return generatePhantomBlinkURL(baseUrl, recipient, amount, label, message);
}

export function generateBackpackURL(recipient: string, amount: number, label?: string, message?: string): string {
  // Backpack supports universal Blinks
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return generateActionBlinkURL(baseUrl, recipient, amount, label, message);
}

/**
 * Generate all links at once (optional - for future use)
 */
export function generateAllLinks(baseUrl: string, recipient: string, amount: number, label?: string, message?: string) {
  return {
    universalBlink: generateActionBlinkURL(baseUrl, recipient, amount, label, message),
    phantomBlink: generatePhantomBlinkURL(baseUrl, recipient, amount, label, message),
    qrCode: generateSolanaPayURL(recipient, amount, label, message)
  };
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