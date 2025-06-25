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
 * KEEP THIS EXACTLY THE SAME - FOR QR CODES AND DIRECT WALLET OPENING
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
 * Generate Phantom deep link that opens directly in Phantom wallet
 */
export function generatePhantomDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `https://phantom.app/ul/v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate Backpack deep link that opens directly in Backpack wallet
 */
export function generateBackpackDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  // Backpack uses a similar format to Phantom
  return `https://backpack.app/ul/v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate Solflare deep link that opens directly in Solflare wallet
 */
export function generateSolflareDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `https://solflare.com/ul/v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate Glow deep link that opens directly in Glow wallet
 */
export function generateGlowDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `https://glow.app/ul/v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate universal deep link that should work with most Solana wallets
 * This creates a web page that attempts to detect and redirect to the user's wallet
 */
export function generateUniversalDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  // This creates a URL that can be used to create a universal redirect page
  return `https://solana.com/pay?url=${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * BACKWARD COMPATIBILITY - Now uses Phantom deep link as default
 */
export function generateBlinkURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generatePhantomDeepLink(recipient, amount, label, message);
}

export function generatePhantomURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generatePhantomDeepLink(recipient, amount, label, message);
}

export function generateBackpackURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generateBackpackDeepLink(recipient, amount, label, message);
}

/**
 * Generate all wallet deep links at once
 */
export function generateAllWalletLinks(recipient: string, amount: number, label?: string, message?: string) {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  
  return {
    // Universal QR code URL (works with all wallets)
    qrCodeUrl: solanaPayUrl,
    
    // Wallet-specific deep links that open directly in the wallet
    phantom: generatePhantomDeepLink(recipient, amount, label, message),
    backpack: generateBackpackDeepLink(recipient, amount, label, message),
    solflare: generateSolflareDeepLink(recipient, amount, label, message),
    glow: generateGlowDeepLink(recipient, amount, label, message),
    universal: generateUniversalDeepLink(recipient, amount, label, message),
    
    // Raw Solana Pay URL (for QR codes and manual wallet entry)
    solanaPayUrl
  };
}

/**
 * Generate a simple transfer URL for web interfaces
 */
export function generateWebTransferURL(recipient: string, amount: number): string {
  try {
    new PublicKey(recipient);
    return `https://solscan.io/account/${recipient}`;
  } catch (error) {
    throw new Error('Invalid recipient address');
  }
}

// Utility functions
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

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}

/**
 * INSTRUCTIONS FOR USING DEEP LINKS:
 * 
 * 1. Deep links open directly in the wallet app (mobile) or extension (desktop)
 * 2. They bypass the need for complex Blink Actions APIs
 * 3. Much more reliable than custom Blinks
 * 4. Work immediately without backend setup
 * 
 * 5. Usage patterns:
 *    - QR codes: Use the raw Solana Pay URL
 *    - Click links: Use wallet-specific deep links
 *    - Universal links: Use the universal deep link for auto-detection
 * 
 * 6. Deep links are perfect for:
 *    - Social media sharing
 *    - Direct wallet opening
 *    - Mobile-first experiences
 *    - Simple payment flows
 */