import { detectMobilePlatform, WALLET_APP_STORES } from './walletDetection';
import { generatePhantomMobileDeepLink, generateBackpackMobileDeepLink, generateSolflareMobileDeepLink, generateGlowMobileDeepLink } from './deepLinks';
import { generateSolanaPayURL, parseUniversalPaymentLink } from './solanaPay';

export interface DeepLinkResult {
  success: boolean;
  deepLink: string;
  fallbackUrl?: string;
  error?: string;
}

export async function handleUniversalPayment(
  recipient: string,
  amount: number,
  label?: string,
  message?: string,
  preferredWallet?: string
): Promise<DeepLinkResult> {
  const platform = detectMobilePlatform();
  const deepLinks = {
    phantom: generatePhantomMobileDeepLink(recipient, amount, label, message),
    backpack: generateBackpackMobileDeepLink(recipient, amount, label, message),
    solflare: generateSolflareMobileDeepLink(recipient, amount, label, message),
    glow: generateGlowMobileDeepLink(recipient, amount, label, message),
    universal: generateSolanaPayURL(recipient, amount, label, message)
  };
  if (preferredWallet && deepLinks[preferredWallet as keyof typeof deepLinks]) {
    try {
      const result = await openWalletWithFallback(
        preferredWallet,
        deepLinks[preferredWallet as keyof typeof deepLinks]
      );
      if (result.success) {
        return result;
      }
    } catch (error) {}
  }
  const walletOrder = ['phantom', 'backpack', 'solflare', 'glow'];
  for (const walletName of walletOrder) {
    if (walletName === preferredWallet) continue;
    try {
      const result = await openWalletWithFallback(
        walletName,
        deepLinks[walletName as keyof typeof deepLinks]
      );
      if (result.success) {
        return result;
      }
    } catch (error) {
      continue;
    }
  }
  try {
    window.location.href = deepLinks.universal;
    return {
      success: true,
      deepLink: deepLinks.universal
    };
  } catch (error) {
    return {
      success: false,
      deepLink: deepLinks.universal,
      error: 'All wallet attempts failed'
    };
  }
}

export async function openWalletWithFallback(
  walletName: string,
  deepLink: string,
  timeoutMs: number = 2500
): Promise<DeepLinkResult> {
  const platform = detectMobilePlatform();
  if (!platform.isMobile) {
    return {
      success: false,
      deepLink,
      error: 'Deep links only work on mobile devices'
    };
  }
  return new Promise((resolve) => {
    let resolved = false;
    let startTime = Date.now();
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const appStoreUrl = platform.isIOS
          ? WALLET_APP_STORES[walletName]?.ios
          : WALLET_APP_STORES[walletName]?.android;
        resolve({
          success: false,
          deepLink,
          fallbackUrl: appStoreUrl,
          error: `${walletName} wallet not installed or failed to open`
        });
      }
    }, timeoutMs);
    const handleVisibilityChange = () => {
      if (document.hidden && !resolved) {
        const timePassed = Date.now() - startTime;
        if (timePassed > 100) {
          resolved = true;
          clearTimeout(timeout);
          resolve({
            success: true,
            deepLink
          });
        }
      }
    };
    const handleBlur = () => {
      if (!resolved) {
        setTimeout(() => {
          if (!resolved && document.hidden) {
            resolved = true;
            clearTimeout(timeout);
            resolve({
              success: true,
              deepLink
            });
          }
        }, 50);
      }
    };
    const handleFocus = () => {
      const timePassed = Date.now() - startTime;
      if (timePassed > 1000 && !resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({
          success: true,
          deepLink
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    try {
      window.location.href = deepLink;
    } catch (error) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({
          success: false,
          deepLink,
          error: 'Failed to open deep link'
        });
      }
    }
    const cleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
    setTimeout(cleanup, timeoutMs + 1000);
  });
}

export function createUniversalPaymentHandler(): void {
  // ... (move the full function here, update imports as needed)
} 