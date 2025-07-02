import { PublicKey } from '@solana/web3.js';

export interface BlinkParams {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
}

export interface MobilePlatform {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
}

export interface WalletAppStoreUrls {
  ios: string;
  android: string;
}

export interface DeepLinkResult {
  success: boolean;
  deepLink: string;
  fallbackUrl?: string;
  error?: string;
}

export interface UniversalLinkConfig {
  domain: string;
  path?: string;
}

// App Store URLs for each wallet
const WALLET_APP_STORES: Record<string, WalletAppStoreUrls> = {
  phantom: {
    ios: 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977',
    android: 'https://play.google.com/store/apps/details?id=app.phantom'
  },
  backpack: {
    ios: 'https://apps.apple.com/app/backpack-crypto-wallet/id1614235241',
    android: 'https://play.google.com/store/apps/details?id=com.backpack'
  },
  solflare: {
    ios: 'https://apps.apple.com/app/solflare/id1599584512',
    android: 'https://play.google.com/store/apps/details?id=com.solflare.mobile'
  },
  glow: {
    ios: 'https://apps.apple.com/app/glow-solana-wallet/id1599584512',
    android: 'https://play.google.com/store/apps/details?id=com.luma.wallet'
  }
};

// Default configuration
const DEFAULT_CONFIG: UniversalLinkConfig = {
  domain: 'blinked-two.vercel.app',
  path: 'pay'
};

/**
 * Detect mobile platform
 */
export function detectMobilePlatform(): MobilePlatform {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobile = isIOS || isAndroid;

  return {
    isIOS,
    isAndroid,
    isMobile
  };
}

/**
 * NEW: Generate Universal Payment Link
 * Creates a shareable web URL that works on any device
 */
export function generateUniversalPaymentLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string,
  config: UniversalLinkConfig = DEFAULT_CONFIG
): string {
  try {
    // Validate recipient address
    new PublicKey(recipient);
    
    const url = new URL(`https://${config.domain}/${config.path || 'pay'}`);
    
    // Add parameters
    url.searchParams.set('to', recipient);
    url.searchParams.set('amount', amount.toString());
    
    if (label) {
      url.searchParams.set('label', label);
    }
    
    if (message) {
      url.searchParams.set('message', message);
    }
    
    return url.toString();
  } catch (error) {
    console.error('Error generating universal payment link:', error);
    throw new Error('Invalid recipient address');
  }
}

/**
 * NEW: Parse Universal Payment Link
 * Extracts payment parameters from a universal link
 */
export function parseUniversalPaymentLink(url: string): BlinkParams | null {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    const recipient = params.get('to');
    const amount = params.get('amount');
    
    if (!recipient || !amount) {
      return null;
    }
    
    // Validate recipient
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

/**
 * NEW: Detect Available Wallets
 * Checks which wallets are installed on the device
 */
export function detectAvailableWallets(): Promise<string[]> {
  return new Promise((resolve) => {
    const platform = detectMobilePlatform();
    const availableWallets: string[] = [];
    
    if (!platform.isMobile) {
      // On desktop, we can't easily detect installed wallets
      // Return all common wallets
      resolve(['phantom', 'backpack', 'solflare', 'glow']);
      return;
    }
    
    // On mobile, try to detect installed wallets by attempting to open them
    const testWallets = [
      { name: 'phantom', scheme: 'phantom://' },
      { name: 'backpack', scheme: 'backpack://' },
      { name: 'solflare', scheme: 'solflare://' },
      { name: 'glow', scheme: 'glow://' }
    ];
    
    let checkedWallets = 0;
    
    testWallets.forEach(wallet => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = wallet.scheme;
      
      const timeout = setTimeout(() => {
        // If timeout occurs, wallet is likely not installed
        checkedWallets++;
        if (checkedWallets === testWallets.length) {
          resolve(availableWallets);
        }
      }, 100);
      
      iframe.onload = () => {
        // If iframe loads successfully, wallet might be available
        availableWallets.push(wallet.name);
        clearTimeout(timeout);
        checkedWallets++;
        if (checkedWallets === testWallets.length) {
          resolve(availableWallets);
        }
      };
      
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 200);
    });
  });
}

/**
 * Generate Solana Pay URL (works with all wallets)
 */
export function generateSolanaPayURL(recipient: string, amount: number, label?: string, message?: string): string {
  try {
    new PublicKey(recipient);
    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    if (label) {
      params.append('label', label);
    }
    if (message) {
      params.append('message', message);
    }
    return `solana:${recipient}?${params.toString()}`;
  } catch (error) {
    console.error('Error generating Solana Pay URL:', error);
    throw new Error('Invalid recipient address');
  }
}

/**
 * Generate Phantom mobile deep link
 */
export function generatePhantomMobileDeepLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string
): string {
  let deepLink = `phantom://v1/send?recipient=${encodeURIComponent(recipient)}&amount=${amount}`;
  
  if (label) {
    deepLink += `&label=${encodeURIComponent(label)}`;
  }
  if (message) {
    deepLink += `&message=${encodeURIComponent(message)}`;
  }
  
  return deepLink;
}

/**
 * Generate Backpack mobile deep link
 */
export function generateBackpackMobileDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `backpack://browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate Solflare mobile deep link
 */
export function generateSolflareMobileDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `solflare://v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate Glow mobile deep link
 */
export function generateGlowMobileDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `glow://browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * NEW: Universal Wallet Handler
 * This is the core function that handles wallet detection and opening
 */
export async function handleUniversalPayment(
  recipient: string,
  amount: number,
  label?: string,
  message?: string,
  preferredWallet?: string
): Promise<DeepLinkResult> {
  const platform = detectMobilePlatform();
  
  // Generate all possible deep links
  const deepLinks = {
    phantom: generatePhantomMobileDeepLink(recipient, amount, label, message),
    backpack: generateBackpackMobileDeepLink(recipient, amount, label, message),
    solflare: generateSolflareMobileDeepLink(recipient, amount, label, message),
    glow: generateGlowMobileDeepLink(recipient, amount, label, message),
    universal: generateSolanaPayURL(recipient, amount, label, message)
  };
  
  // If a preferred wallet is specified, try that first
  if (preferredWallet && deepLinks[preferredWallet as keyof typeof deepLinks]) {
    try {
      const result = await openWalletWithFallback(
        preferredWallet,
        deepLinks[preferredWallet as keyof typeof deepLinks]
      );
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.log(`Preferred wallet ${preferredWallet} failed, trying others...`);
    }
  }
  
  // Try wallets in order of popularity
  const walletOrder = ['phantom', 'backpack', 'solflare', 'glow'];
  
  for (const walletName of walletOrder) {
    if (walletName === preferredWallet) continue; // Skip if already tried
    
    try {
      const result = await openWalletWithFallback(
        walletName,
        deepLinks[walletName as keyof typeof deepLinks]
      );
      
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.log(`Wallet ${walletName} failed, trying next...`);
      continue;
    }
  }
  
  // If all specific wallets fail, try universal Solana Pay URL
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

/**
 * NEW: Create Universal Payment Handler Page
 * This function should be called on your payment page (blinked-two.vercel.app/pay)
 */
export function createUniversalPaymentHandler(): void {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const paymentParams = parseUniversalPaymentLink(window.location.href);
  
  if (!paymentParams) {
    document.body.innerHTML = `
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h2>Invalid Payment Link</h2>
        <p>The payment link is missing required parameters.</p>
      </div>
    `;
    return;
  }
  
  const platform = detectMobilePlatform();
  
  // Create the payment page UI
  document.body.innerHTML = `
    <div id="payment-container" style="
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      color: white;
      text-align: center;
    ">
      <h2 style="margin-bottom: 20px;">💰 Solana Payment</h2>
      
      <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
        <p><strong>Amount:</strong> ${paymentParams.amount} SOL</p>
        ${paymentParams.label ? `<p><strong>Label:</strong> ${paymentParams.label}</p>` : ''}
        ${paymentParams.message ? `<p><strong>Message:</strong> ${paymentParams.message}</p>` : ''}
        <p style="font-size: 12px; opacity: 0.8; word-break: break-all;">
          <strong>To:</strong> ${paymentParams.recipient}
        </p>
      </div>
      
      <div id="wallet-buttons"></div>
      
      <div id="status" style="margin-top: 20px; font-size: 14px; opacity: 0.9;"></div>
      
      <div style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
        <p>Secure payment powered by Solana</p>
      </div>
    </div>
  `;
  
  // Add wallet buttons
  const buttonsContainer = document.getElementById('wallet-buttons')!;
  
  if (platform.isMobile) {
    // Mobile: Show wallet-specific buttons
    buttonsContainer.innerHTML = `
      <button id="auto-detect" style="
        width: 100%;
        padding: 15px;
        margin-bottom: 15px;
        background: rgba(255,255,255,0.3);
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        backdrop-filter: blur(10px);
      ">🚀 Open Any Wallet</button>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
        <button id="phantom-btn" class="wallet-btn">👻 Phantom</button>
        <button id="backpack-btn" class="wallet-btn">🎒 Backpack</button>
        <button id="solflare-btn" class="wallet-btn">☀️ Solflare</button>
        <button id="glow-btn" class="wallet-btn">✨ Glow</button>
      </div>
      
      <style>
        .wallet-btn {
          padding: 12px 8px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .wallet-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
      </style>
    `;
  } else {
    // Desktop: Show QR code option
    buttonsContainer.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
        <div id="qr-code" style="display: flex; justify-content: center; margin-bottom: 15px;">
          <div style="
            background: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            color: #333;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
          ">
            ${generateSolanaPayURL(paymentParams.recipient, paymentParams.amount, paymentParams.label, paymentParams.message)}
          </div>
        </div>
        <p style="color: #333; font-size: 14px;">Scan this QR code with your mobile wallet</p>
      </div>
      
      <button id="copy-link" style="
        width: 100%;
        padding: 15px;
        background: rgba(255,255,255,0.3);
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        cursor: pointer;
      ">📋 Copy Payment Link</button>
    `;
  }
  
  // Add event listeners
  const statusDiv = document.getElementById('status')!;
  
  // Auto-detect wallet button
  const autoDetectBtn = document.getElementById('auto-detect');
  if (autoDetectBtn) {
    autoDetectBtn.addEventListener('click', async () => {
      statusDiv.textContent = 'Opening wallet...';
      try {
        const result = await handleUniversalPayment(
          paymentParams.recipient,
          paymentParams.amount,
          paymentParams.label,
          paymentParams.message
        );
        
        if (result.success) {
          statusDiv.textContent = '✅ Wallet opened successfully!';
        } else {
          statusDiv.textContent = '❌ Failed to open wallet. Try installing a Solana wallet.';
        }
      } catch (error) {
        statusDiv.textContent = '❌ Error opening wallet';
      }
    });
  }
  
  // Specific wallet buttons
  const walletButtons = [
    { id: 'phantom-btn', wallet: 'phantom' },
    { id: 'backpack-btn', wallet: 'backpack' },
    { id: 'solflare-btn', wallet: 'solflare' },
    { id: 'glow-btn', wallet: 'glow' }
  ];
  
  walletButtons.forEach(({ id, wallet }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', async () => {
        statusDiv.textContent = `Opening ${wallet}...`;
        try {
          const result = await handleUniversalPayment(
            paymentParams.recipient,
            paymentParams.amount,
            paymentParams.label,
            paymentParams.message,
            wallet
          );
          
          if (result.success) {
            statusDiv.textContent = `✅ ${wallet} opened successfully!`;
          } else {
            statusDiv.textContent = `❌ ${wallet} not found. Try installing it first.`;
            if (result.fallbackUrl) {
              setTimeout(() => {
                if (confirm(`Install ${wallet}?`)) {
                  window.location.href = result.fallbackUrl!;
                }
              }, 1000);
            }
          }
        } catch (error) {
          statusDiv.textContent = `❌ Error opening ${wallet}`;
        }
      });
    }
  });
  
  // Copy link button
  const copyBtn = document.getElementById('copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        statusDiv.textContent = '📋 Payment link copied!';
        setTimeout(() => {
          statusDiv.textContent = '';
        }, 2000);
      });
    });
  }
  
  // Auto-open wallet if on mobile and user came from a direct link
  if (platform.isMobile && document.referrer === '') {
    // Small delay to let the page load
    setTimeout(() => {
      if (autoDetectBtn) {
        autoDetectBtn.click();
      }
    }, 1000);
  }
}

/**
 * Improved wallet opening with fallback
 */
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

// Backward compatibility
export function generateBlinkURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generateUniversalPaymentLink(recipient, amount, label, message);
}

export function generatePhantomURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generatePhantomMobileDeepLink(recipient, amount, label, message);
}

export function generateBackpackURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generateBackpackMobileDeepLink(recipient, amount, label, message);
}