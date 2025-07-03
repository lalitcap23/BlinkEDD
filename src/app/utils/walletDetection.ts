export interface MobilePlatform {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
}

export interface WalletAppStoreUrls {
  ios: string;
  android: string;
}

export const WALLET_APP_STORES: Record<string, WalletAppStoreUrls> = {
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

export function detectMobilePlatform(): MobilePlatform {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobile = isIOS || isAndroid;
  return { isIOS, isAndroid, isMobile };
}

export function detectAvailableWallets(): Promise<string[]> {
  return new Promise((resolve) => {
    const platform = detectMobilePlatform();
    const availableWallets: string[] = [];
    if (!platform.isMobile) {
      resolve(['phantom', 'backpack', 'solflare', 'glow']);
      return;
    }
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
        checkedWallets++;
        if (checkedWallets === testWallets.length) {
          resolve(availableWallets);
        }
      }, 100);
      iframe.onload = () => {
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