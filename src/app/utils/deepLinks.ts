import { generateSolanaPayURL } from './solanaPay';

export function generatePhantomMobileDeepLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string
): string {
  let deepLink = `phantom://v1/send?recipient=${encodeURIComponent(recipient)}&amount=${amount}`;
  if (label) deepLink += `&label=${encodeURIComponent(label)}`;
  if (message) deepLink += `&message=${encodeURIComponent(message)}`;
  return deepLink;
}

export function generateBackpackMobileDeepLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string
): string {
  // Return the Solana Pay URI directly
  return generateSolanaPayURL(recipient, amount, label, message);
}

export function generateSolflareMobileDeepLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string
): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `solflare://v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

export function generateGlowMobileDeepLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string
): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `glow://browse/${encodeURIComponent(solanaPayUrl)}`;
} 