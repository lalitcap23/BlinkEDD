import { PublicKey } from '@solana/web3.js';

export interface BlinkParams {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
}

export interface UniversalLinkConfig {
  domain: string;
  path?: string;
}

const DEFAULT_CONFIG: UniversalLinkConfig = {
  domain: 'blinked-two.vercel.app',
  path: 'pay'
};

export function generateSolanaPayURL(
  recipient: string,
  amount: number,
  label?: string,
  message?: string,
  options?: { forceHttps?: boolean }
): string {
  try {
    new PublicKey(recipient);
    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    if (label) params.append('label', label);
    if (message) params.append('message', message);
    if (options?.forceHttps) {
      params.append('recipient', recipient);
      return `https://solana.com/pay?${params.toString()}`;
    } else {
      return `solana:${recipient}?${params.toString()}`;
    }
  } catch (error) {
    console.error('Error generating Solana Pay URL:', error);
    throw new Error('Invalid recipient address');
  }
}

export function generateUniversalPaymentLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string,
  config: UniversalLinkConfig = DEFAULT_CONFIG
): string {
  try {
    new PublicKey(recipient);
    const url = new URL(`https://${config.domain}/${config.path || 'pay'}`);
    url.searchParams.set('to', recipient);
    url.searchParams.set('amount', amount.toString());
    if (label) url.searchParams.set('label', label);
    if (message) url.searchParams.set('message', message);
    return url.toString();
  } catch (error) {
    console.error('Error generating universal payment link:', error);
    throw new Error('Invalid recipient address');
  }
}

export function parseUniversalPaymentLink(url: string): BlinkParams | null {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    const recipient = params.get('to');
    const amount = params.get('amount');
    if (!recipient || !amount) return null;
    new PublicKey(recipient);
    return {
      recipient,
      amount: parseFloat(amount),
      label: params.get('label') || undefined,
      message: params.get('message') || undefined
    };
  } catch (error) {
    console.error('Error parsing universal payment link:', error);
    return null;
  }
} 