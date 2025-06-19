// utils/generateBlink.ts
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

export interface BlinkParams {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
}

export function generateBlinkURL(recipient: string, amount: number, label?: string, message?: string): string {
  try {
    // Validate recipient address
    new PublicKey(recipient);
    
    // Convert amount to lamports (1 SOL = 1,000,000,000 lamports)
    const lamports = Math.floor(amount * 1_000_000_000);
    
    // Create base URL for Phantom wallet
    const baseUrl = 'https://phantom.app/ul/browse';
    
    // Create the transaction parameters
    const params = new URLSearchParams({
      recipient: recipient,
      amount: lamports.toString(),
      ...(label && { label }),
      ...(message && { message }),
    });
    
    // For Solana Pay standard
    const solanaPayUrl = `solana:${recipient}?${params.toString()}`;
    
    // For Phantom deep link
    const phantomUrl = `${baseUrl}/${encodeURIComponent(solanaPayUrl)}`;
    
    return phantomUrl;
  } catch (error) {
    console.error('Error generating blink URL:', error);
    throw new Error('Invalid recipient address');
  }
}

export function generateSolanaPayURL(recipient: string, amount: number, label?: string, message?: string): string {
  try {
    // Validate recipient address
    new PublicKey(recipient);
    
    // Convert amount to lamports
    const lamports = Math.floor(amount * 1_000_000_000);
    
    const params = new URLSearchParams({
      amount: lamports.toString(),
      ...(label && { label }),
      ...(message && { message }),
    });
    
    return `solana:${recipient}?${params.toString()}`;
  } catch (error) {
    console.error('Error generating Solana Pay URL:', error);
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
  return `${amount.toFixed(4)} SOL`;
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}