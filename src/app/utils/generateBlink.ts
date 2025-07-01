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
    ios: 'https://apps.apple.com/app/solflare/id1580902717',
    android: 'https://play.google.com/store/apps/details?id=com.solflare.mobile'
  },
  glow: {
    ios: 'https://apps.apple.com/app/glow-solana-wallet/id1599584512',
    android: 'https://play.google.com/store/apps/details?id=com.luma.wallet'
  }
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
 * Check if we're on mobile, throw error if not
 */
function ensureMobile(): void {
  const platform = detectMobilePlatform();
  if (!platform.isMobile) {
    throw new Error('Mobile wallet deep links only work on mobile devices. Use QR codes for desktop.');
  }
}

/**
 * Generate Solana Pay URL (works with all wallets - UNCHANGED for QR codes)
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
 * Generate Phantom mobile deep link - NOW RETURNS JUST THE URL
 */
export function generatePhantomMobileDeepLink(
  recipient: string,
  amount: number,
  label?: string,
  message?: string
): string {
  // Build the Phantom deep link URL
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
 * Generate Backpack mobile deep link - REAL MOBILE SCHEME
 */
export function generateBackpackMobileDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  ensureMobile();
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `backpack://browse/${encodeURIComponent(solanaPayUrl)}`;
}

/** 
 * Generate Solflare mobile deep link - REAL MOBILE SCHEME
 */
export function generateSolflareMobileDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  ensureMobile();
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `solflare://v1/browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * Generate Glow mobile deep link - REAL MOBILE SCHEME
 */
export function generateGlowMobileDeepLink(recipient: string, amount: number, label?: string, message?: string): string {
  ensureMobile();
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return `glow://browse/${encodeURIComponent(solanaPayUrl)}`;
}

/**
 * NEW: HTML wrapper function to make URLs clickable
 * Converts any deep link URL into a clickable HTML element
 */
export function createClickableDeepLink(
  deepLinkUrl: string,
  buttonText: string = 'Open Wallet',
  walletName: string = 'Wallet'
): string {
  return `<a href="${deepLinkUrl}" 
             class="wallet-deep-link" 
             data-wallet="${walletName.toLowerCase()}"
             style="
               display: inline-block;
               padding: 12px 24px;
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               color: white;
               text-decoration: none;
               border-radius: 12px;
               font-weight: 600;
               font-size: 16px;
               text-align: center;
               cursor: pointer;
               transition: all 0.3s ease;
               box-shadow: 0 4px 15px rgba(0,0,0,0.2);
               border: none;
               min-width: 200px;
               margin: 8px;
             "
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)';"
             ontouchstart="this.style.transform='scale(0.98)';"
             ontouchend="this.style.transform='scale(1)';">
    🔗 ${buttonText}
  </a>`;
}

/**
 * NEW: Create clickable link for Phantom wallet
 */
export function createPhantomClickableLink(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string,
  buttonText: string = 'Open Phantom Wallet'
): string {
  const deepLink = generatePhantomMobileDeepLink(recipient, amount, label, message);
  return createClickableDeepLink(deepLink, buttonText, 'Phantom');
}

/**
 * NEW: Create clickable link for Backpack wallet
 */
export function createBackpackClickableLink(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string,
  buttonText: string = 'Open Backpack Wallet'
): string {
  const deepLink = generateBackpackMobileDeepLink(recipient, amount, label, message);
  return createClickableDeepLink(deepLink, buttonText, 'Backpack');
}

/**
 * NEW: Create clickable link for Solflare wallet
 */
export function createSolflareClickableLink(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string,
  buttonText: string = 'Open Solflare Wallet'
): string {
  const deepLink = generateSolflareMobileDeepLink(recipient, amount, label, message);
  return createClickableDeepLink(deepLink, buttonText, 'Solflare');
}

/**
 * NEW: Create clickable link for Glow wallet
 */
export function createGlowClickableLink(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string,
  buttonText: string = 'Open Glow Wallet'
): string {
  const deepLink = generateGlowMobileDeepLink(recipient, amount, label, message);
  return createClickableDeepLink(deepLink, buttonText, 'Glow');
}

/**
 * NEW: Create clickable link for universal Solana Pay (works with all wallets)
 */
export function createSolanaPayClickableLink(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string,
  buttonText: string = 'Open with Any Wallet'
): string {
  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  return createClickableDeepLink(solanaPayUrl, buttonText, 'SolanaPay');
}

/**
 * NEW: Generate all wallet clickable links at once
 */
export function generateAllClickableWalletLinks(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string
): {
  phantom: string;
  backpack: string;
  solflare: string;
  glow: string;
  universal: string;
  allLinksContainer: string;
} {
  const phantom = createPhantomClickableLink(recipient, amount, label, message);
  const backpack = createBackpackClickableLink(recipient, amount, label, message);
  const solflare = createSolflareClickableLink(recipient, amount, label, message);
  const glow = createGlowClickableLink(recipient, amount, label, message);
  const universal = createSolanaPayClickableLink(recipient, amount, label, message);
  
  const allLinksContainer = `
    <div class="wallet-links-container" style="
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
    ">
      <h3 style="text-align: center; margin-bottom: 16px; color: #333;">Choose Your Wallet</h3>
      ${universal}
      ${phantom}
      ${backpack}
      ${solflare}
      ${glow}
    </div>
  `;
  
  return {
    phantom,
    backpack,
    solflare,
    glow,
    universal,
    allLinksContainer
  };
}

/**
 * NEW: Insert clickable links into DOM element
 */
export function insertClickableLinksIntoPage(
  elementId: string,
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found`);
    return;
  }
  
  const links = generateAllClickableWalletLinks(recipient, amount, label, message);
  element.innerHTML = links.allLinksContainer;
}

/**
 * IMPROVED: Trigger deep link with better mobile compatibility
 * This uses multiple methods to ensure the deep link works on different mobile browsers
 */
export function triggerDeepLink(deepLink: string): void {
  const platform = detectMobilePlatform();
  
  if (!platform.isMobile) {
    console.warn('Deep links work best on mobile devices');
    return;
  }

  // Method 1: Try window.location.href (most reliable)
  try {
    window.location.href = deepLink;
  } catch (error) {
    console.error('Method 1 failed:', error);
    
    // Method 2: Try creating a temporary link and clicking it
    try {
      const tempLink = document.createElement('a');
      tempLink.href = deepLink;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch (error2) {
      console.error('Method 2 failed:', error2);
      
      // Method 3: Try window.open
      try {
        window.open(deepLink, '_self');
      } catch (error3) {
        console.error('All methods failed:', error3);
      }
    }
  }
}

/**
 * IMPROVED: Open wallet with better timeout and fallback handling
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
    
    // Set up timeout to detect if wallet didn't open
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

    // Track if user left the page (wallet opened)
    const handleVisibilityChange = () => {
      if (document.hidden && !resolved) {
        // Check if enough time has passed to consider it a successful open
        const timePassed = Date.now() - startTime;
        if (timePassed > 100) { // At least 100ms should have passed
          resolved = true;
          clearTimeout(timeout);
          resolve({
            success: true,
            deepLink
          });
        }
      }
    };

    // Track page focus loss (wallet opened)
    const handleBlur = () => {
      if (!resolved) {
        // Small delay to ensure it's not just a brief focus loss
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

    // Track when user returns to page (wallet closed)
    const handleFocus = () => {
      const timePassed = Date.now() - startTime;
      if (timePassed > 1000 && !resolved) {
        // If they return after more than 1 second, consider it successful
        resolved = true;
        clearTimeout(timeout);
        resolve({
          success: true,
          deepLink
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Try to open the deep link using improved method
    try {
      triggerDeepLink(deepLink);
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

    // Cleanup function
    const cleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };

    // Clean up after timeout
    setTimeout(cleanup, timeoutMs + 1000);
  });
}

/**
 * IMPROVED: Open Phantom mobile wallet with fallback
 */
export async function openPhantomMobile(recipient: string, amount: number, label?: string, message?: string): Promise<DeepLinkResult> {
  const deepLink = generatePhantomMobileDeepLink(recipient, amount, label, message);
  return openWalletWithFallback('phantom', deepLink);
}

/**
 * IMPROVED: Open Backpack mobile wallet with fallback
 */
export async function openBackpackMobile(recipient: string, amount: number, label?: string, message?: string): Promise<DeepLinkResult> {
  const deepLink = generateBackpackMobileDeepLink(recipient, amount, label, message);
  return openWalletWithFallback('backpack', deepLink);
}

/**
 * IMPROVED: Open Solflare mobile wallet with fallback
 */
export async function openSolflareMobile(recipient: string, amount: number, label?: string, message?: string): Promise<DeepLinkResult> {
  const deepLink = generateSolflareMobileDeepLink(recipient, amount, label, message);
  return openWalletWithFallback('solflare', deepLink);
}

/**
 * IMPROVED: Open Glow mobile wallet with fallback
 */
export async function openGlowMobile(recipient: string, amount: number, label?: string, message?: string): Promise<DeepLinkResult> {
  const deepLink = generateGlowMobileDeepLink(recipient, amount, label, message);
  return openWalletWithFallback('glow', deepLink);
}

/**
 * NEW: Create clickable wallet buttons for better UX
 */
export function createWalletButtons(
  recipient: string, 
  amount: number, 
  label?: string, 
  message?: string,
  container?: HTMLElement
): HTMLElement {
  const platform = detectMobilePlatform();
  
  if (!platform.isMobile) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <p>Mobile wallet deep links only work on mobile devices.</p>
      <p>Use QR code: <code>${generateSolanaPayURL(recipient, amount, label, message)}</code></p>
    `;
    return errorDiv;
  }

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'wallet-buttons-container';
  buttonsContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 300px;
    margin: 0 auto;
  `;

  const wallets = [
    { name: 'solana', displayName: 'Any Wallet', generator: generateSolanaPayURL },
    { name: 'phantom', displayName: 'Phantom', generator: generatePhantomMobileDeepLink },
    { name: 'backpack', displayName: 'Backpack', generator: generateBackpackMobileDeepLink },
    { name: 'solflare', displayName: 'Solflare', generator: generateSolflareMobileDeepLink },
    { name: 'glow', displayName: 'Glow', generator: generateGlowMobileDeepLink }
  ];

  wallets.forEach(wallet => {
    try {
      const deepLink = wallet.generator(recipient, amount, label, message);
      
      // Create button element
      const button = document.createElement('a');
      button.href = deepLink;
      button.textContent = `Open ${wallet.displayName} Wallet`;
      button.className = 'wallet-deep-link';
      
      // Add styles
      button.style.cssText = `
        display: inline-block;
        padding: 12px 24px;
        background-color: #512da8;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      
      // Add hover effect
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#4527a0';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#512da8';
      });
      
      // Add click handler for better reliability
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
          const result = await openWalletWithFallback(wallet.name, deepLink);
          
          if (!result.success && result.fallbackUrl) {
            // If wallet didn't open, redirect to app store after a short delay
            setTimeout(() => {
              if (confirm(`${wallet.displayName} wallet not found. Would you like to install it?`)) {
                window.location.href = result.fallbackUrl!;
              }
            }, 100);
          }
        } catch (error) {
          console.error(`Failed to open ${wallet.displayName}:`, error);
        }
      });
      
      buttonsContainer.appendChild(button);
    } catch (error) {
      console.error(`Failed to create ${wallet.displayName} button:`, error);
    }
  });

  if (container) {
    container.appendChild(buttonsContainer);
  }

  return buttonsContainer;
}

/**
 * Generate all mobile wallet deep links - MOBILE ONLY
 */
export function generateAllMobileWalletLinks(recipient: string, amount: number, label?: string, message?: string) {
  const platform = detectMobilePlatform();
  
  if (!platform.isMobile) {
    return {
      error: 'Mobile wallet deep links only work on mobile devices',
      qrCodeUrl: generateSolanaPayURL(recipient, amount, label, message), // QR code still works
      platform
    };
  }

  const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
  
  return {
    // Universal QR code URL (works with all wallets)
    qrCodeUrl: solanaPayUrl,
    
    // Mobile-specific deep links that open directly in the wallet app
    phantom: generatePhantomMobileDeepLink(recipient, amount, label, message),
    backpack: generateBackpackMobileDeepLink(recipient, amount, label, message),
    solflare: generateSolflareMobileDeepLink(recipient, amount, label, message),
    glow: generateGlowMobileDeepLink(recipient, amount, label, message),
    
    // Raw Solana Pay URL (for QR codes)
    solanaPayUrl,
    
    // Platform info
    platform,
    
    // App store URLs for fallback
    appStores: WALLET_APP_STORES
  };
}

/**
 * BACKWARD COMPATIBILITY - Now uses Phantom mobile deep link
 */
export function generateBlinkURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generatePhantomMobileDeepLink(recipient, amount, label, message);
}

export function generatePhantomURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generatePhantomMobileDeepLink(recipient, amount, label, message);
}

export function generateBackpackURL(recipient: string, amount: number, label?: string, message?: string): string {
  return generateBackpackMobileDeepLink(recipient, amount, label, message);
}

// Utility functions - UNCHANGED
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
 * USAGE EXAMPLES:
 * 
 * // Method 1: Create individual clickable links (HTML strings)
 * const phantomButton = createPhantomClickableLink(address, amount, label, message);
 * document.getElementById('container').innerHTML = phantomButton;
 * 
 * // Method 2: Create all wallet links at once
 * const allLinks = generateAllClickableWalletLinks(address, amount, label, message);
 * document.getElementById('container').innerHTML = allLinks.allLinksContainer;
 * 
 * // Method 3: Insert directly into page
 * insertClickableLinksIntoPage('my-container', address, amount, label, message);
 * 
 * // Method 4: Create DOM elements (for more control)
 * const buttonsContainer = createWalletButtons(address, amount, label, message);
 * document.getElementById('container').appendChild(buttonsContainer);
 * 
 * // Method 5: Get just the URL (unchanged - for QR codes)
 * const qrUrl = generateSolanaPayURL(address, amount, label, message);
 * 
 * // Method 6: Individual wallet URLs (unchanged)
 * const phantomUrl = generatePhantomMobileDeepLink(address, amount, label, message);
 */