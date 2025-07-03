import React, { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import {
  generateSolanaPayURL,
  generatePhantomMobileDeepLink,
  generateBackpackMobileDeepLink,
  generateSolflareMobileDeepLink,
  generateGlowMobileDeepLink,
  handleUniversalPayment
} from '../utils/generateBlink';

const getWalletEmoji = (walletName: string) => {
  switch (walletName.toLowerCase()) {
    case 'phantom': return '👻';
    case 'backpack': return '🎒';
    case 'solflare': return '☀️';
    case 'glow': return '✨';
    case 'any wallet':
    case 'universal': return '🔗';
    default: return '🔗';
  }
};

const getGradientColors = (walletName: string) => {
  switch (walletName.toLowerCase()) {
    case 'phantom': return { normal: '#6366f1 0%, #8b5cf6 100%', hover: '#5b21b6 0%, #7c3aed 100%' };
    case 'backpack': return { normal: '#f59e0b 0%, #d97706 100%', hover: '#d97706 0%, #b45309 100%' };
    case 'solflare': return { normal: '#eab308 0%, #ca8a04 100%', hover: '#ca8a04 0%, #a16207 100%' };
    case 'glow': return { normal: '#3b82f6 0%, #1d4ed8 100%', hover: '#1d4ed8 0%, #1e40af 100%' };
    case 'any wallet':
    case 'universal': return { normal: '#9945FF 0%, #14F195 100%', hover: '#8b5cf6 0%, #10b981 100%' };
    default: return { normal: '#6b7280 0%, #4b5563 100%', hover: '#4b5563 0%, #374151 100%' };
  }
};

const WalletButton = ({
  recipient,
  amount,
  label,
  message,
  walletName,
  isMobile,
  onCopy,
  onStatusUpdate
}: {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
  walletName: string;
  isMobile: boolean;
  onCopy: (link: string, wallet: string) => void;
  onStatusUpdate: (status: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    onStatusUpdate(`Opening ${walletName}...`);
    try {
      if (walletName.toLowerCase() === 'any wallet' || walletName.toLowerCase() === 'universal') {
        const result = await handleUniversalPayment(recipient, amount, label, message);
        if (result.success) {
          onStatusUpdate(`✅ ${walletName} opened successfully!`);
        } else {
          onStatusUpdate(`❌ ${result.error || 'Failed to open wallet'}`);
        }
      } else {
        const result = await handleUniversalPayment(recipient, amount, label, message, walletName.toLowerCase());
        if (result.success) {
          onStatusUpdate(`✅ ${walletName} opened successfully!`);
        } else {
          onStatusUpdate(`❌ ${walletName} not found. Try installing it first.`);
          if (result.fallbackUrl && window.confirm(`Install ${walletName}?`)) {
            window.open(result.fallbackUrl, '_blank');
          }
        }
      }
    } catch (error) {
      onStatusUpdate(`❌ Error opening ${walletName}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => onStatusUpdate(''), 3000);
    }
  };

  const getDeepLink = () => {
    switch (walletName.toLowerCase()) {
      case 'phantom': return generatePhantomMobileDeepLink(recipient, amount, label, message);
      case 'backpack': return generateBackpackMobileDeepLink(recipient, amount, label, message);
      case 'solflare': return generateSolflareMobileDeepLink(recipient, amount, label, message);
      case 'glow': return generateGlowMobileDeepLink(recipient, amount, label, message);
      default: return generateSolanaPayURL(recipient, amount, label, message);
    }
  };
  const deepLink = getDeepLink();

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={isProcessing}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`block w-full p-4 rounded-xl text-white font-semibold text-center transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${isHovered ? 'shadow-lg' : 'shadow-sm'}`}
        style={{
          background: isHovered
            ? `linear-gradient(135deg, ${getGradientColors(walletName).hover})`
            : `linear-gradient(135deg, ${getGradientColors(walletName).normal})`,
        }}
      >
        <div className="flex items-center justify-center gap-3">
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-lg">{getWalletEmoji(walletName)}</span>
          )}
          <span>{isProcessing ? 'Opening...' : `Open ${walletName}`}</span>
          {!isProcessing && <ExternalLink className="w-4 h-4" />}
        </div>
        <div className="text-xs mt-1 opacity-80">
          {isMobile ? 'Tap to open app directly' : 'Click to open payment'}
        </div>
      </button>
      <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
        <input
          type="text"
          value={deepLink}
          readOnly
          className="flex-1 text-gray-500 bg-transparent outline-none font-mono text-xs"
        />
        <button
          onClick={() => onCopy(deepLink, walletName.toLowerCase())}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default WalletButton; 