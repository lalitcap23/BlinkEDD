'use client';

import { useState } from 'react';
import {
  generateSolanaPayURL,
  generatePhantomMobileDeepLink,
  generateBackpackMobileDeepLink,
  generateSolflareMobileDeepLink,
  generateGlowMobileDeepLink,
  generateAllMobileWalletLinks,
  validateSolanaAddress,
  detectMobilePlatform
} from '../utils/generateBlink';
import { Copy, ExternalLink, QrCode, Check, AlertCircle, Wallet, Smartphone } from 'lucide-react';

// QR Code component - uses the universal Solana Pay URL for maximum compatibility
const QRCodeDisplay = ({ value, size = 200 }: { value: string; size?: number }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=000000&margin=1&ecc=M`;
  
  return (
    <div className="relative">
      <img 
        src={qrUrl} 
        alt="QR Code for payment" 
        width={size} 
        height={size}
        className="border border-gray-200 rounded-lg shadow-sm"
        onError={(e) => {
          console.error('QR Code failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
        Compatible with all Solana wallets
      </div>
    </div>
  );
};

// NEW: Clickable Deep Link Button Component
const ClickableDeepLinkButton = ({ 
  deepLink, 
  walletName, 
  color, 
  isMobile,
  onCopy 
}: { 
  deepLink: string; 
  walletName: string; 
  color: string;
  isMobile: boolean;
  onCopy: (link: string, wallet: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Opening ${walletName} with:`, deepLink);
    
    if (isMobile) {
      // Direct deep link opening for mobile
      window.location.href = deepLink;
    } else {
      // For desktop, open in new tab (shows QR code)
      window.open(deepLink, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      {/* Clickable Button */}
      <a
        href={deepLink}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          block w-full p-4 rounded-xl text-white font-semibold text-center
          transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
          ${color} ${isHovered ? 'shadow-lg' : 'shadow-sm'}
        `}
        style={{
          background: isHovered 
            ? `linear-gradient(135deg, ${getGradientColors(walletName).hover})` 
            : `linear-gradient(135deg, ${getGradientColors(walletName).normal})`,
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg">{getWalletEmoji(walletName)}</span>
          <span>Open {walletName} Wallet</span>
          <ExternalLink className="w-4 h-4" />
        </div>
        <div className="text-xs mt-1 opacity-80">
          {isMobile ? 'Tap to open app directly' : 'Click to open payment'}
        </div>
      </a>

      {/* Copy Link Row */}
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

// Helper functions for wallet styling
const getWalletEmoji = (walletName: string) => {
  switch (walletName.toLowerCase()) {
    case 'phantom': return '👻';
    case 'backpack': return '🎒';
    case 'solflare': return '☀️';
    case 'glow': return '✨';
    case 'any wallet': return '🔗';
    default: return '🔗';
  }
};

const getGradientColors = (walletName: string) => {
  switch (walletName.toLowerCase()) {
    case 'phantom': 
      return { 
        normal: '#6366f1 0%, #8b5cf6 100%', 
        hover: '#5b21b6 0%, #7c3aed 100%' 
      };
    case 'backpack': 
      return { 
        normal: '#f59e0b 0%, #d97706 100%', 
        hover: '#d97706 0%, #b45309 100%' 
      };
    case 'solflare': 
      return { 
        normal: '#eab308 0%, #ca8a04 100%', 
        hover: '#ca8a04 0%, #a16207 100%' 
      };
    case 'glow': 
      return { 
        normal: '#3b82f6 0%, #1d4ed8 100%', 
        hover: '#1d4ed8 0%, #1e40af 100%' 
      };
    case 'any wallet':
      return {
        normal: '#9945FF 0%, #14F195 100%',
        hover: '#8b5cf6 0%, #10b981 100%'
      };
    default: 
      return { 
        normal: '#6b7280 0%, #4b5563 100%', 
        hover: '#4b5563 0%, #374151 100%' 
      };
  }
};

export default function BlinkForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number>(0.001);
  const [label, setLabel] = useState('Support Me');
  const [message, setMessage] = useState('');
  
  // Generated URLs
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // For QR code (direct wallet)
  const [phantomLink, setPhantomLink] = useState(''); // Phantom deep link
  const [backpackLink, setBackpackLink] = useState(''); // Backpack deep link
  const [solflareLink, setSolflareLink] = useState(''); // Solflare deep link
  const [glowLink, setGlowLink] = useState(''); // Glow deep link
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleGenerate = async () => {
    setError('');
    
    // Validation
    if (!recipient.trim()) {
      setError('Wallet address is required');
      return;
    }

    if (!validateSolanaAddress(recipient.trim())) {
      setError('Invalid Solana wallet address');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (amount > 1000) {
      setError('Amount seems too large. Please double-check.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Check if mobile
      const platform = detectMobilePlatform();
      setIsMobile(platform.isMobile);

      // Generate QR code URL (direct wallet opening)
      const qrUrl = generateSolanaPayURL(recipient.trim(), amount, label.trim(), message.trim());
      setQrCodeUrl(qrUrl);

      if (platform.isMobile) {
        // Generate mobile deep links for each wallet
        const phantomUrl = generatePhantomMobileDeepLink(recipient.trim(), amount, label.trim(), message.trim());
        const backpackUrl = generateBackpackMobileDeepLink(recipient.trim(), amount, label.trim(), message.trim());
        const solflareUrl = generateSolflareMobileDeepLink(recipient.trim(), amount, label.trim(), message.trim());
        const glowUrl = generateGlowMobileDeepLink(recipient.trim(), amount, label.trim(), message.trim());
        
        setPhantomLink(phantomUrl);
        setBackpackLink(backpackUrl);
        setSolflareLink(solflareUrl);
        setGlowLink(glowUrl);
      } else {
        // On desktop, all links are the same QR code URL
        setPhantomLink(qrUrl);
        setBackpackLink(qrUrl);
        setSolflareLink(qrUrl);
        setGlowLink(qrUrl);
      }
      
      console.log('Generated Links:', {
        qrUrl,
        platform,
        amount: amount,
        recipient: recipient.trim()
      });
      
    } catch (err) {
      console.error('Error generating deep links:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate deep links');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ⚡ Solana Payment Link Generator
        </h1>
        <p className="text-gray-600">Create clickable wallet links that open instantly in any Solana wallet</p>
        <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
          <span>✅ Phantom</span>
          <span>✅ Backpack</span>
          <span>✅ Solflare</span>
          <span>✅ Glow</span>
          <span>✅ All wallets</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipient Wallet Address *
          </label>
          <input
            type="text"
            placeholder="Enter Solana wallet address (44 characters)"
            className="w-full border text-black border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-mono"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          {recipient && !validateSolanaAddress(recipient) && (
            <p className="text-xs text-red-500 mt-1">Invalid Solana address format</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount (SOL) *
          </label>
          <input
            type="number"
            placeholder="0.001"
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
            value={amount}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setAmount(isNaN(value) ? 0 : value);
            }}
            min="0"
            step="0.001"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min: 0.001 SOL</span>
            <span>≈ ${(amount * 25).toFixed(3)} USD</span>
          </div>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Label
          </label>
          <input
            type="text"
            placeholder="e.g., Buy me a coffee, Tip for content"
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            placeholder="Add a personal message..."
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-black"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !recipient.trim() || amount <= 0 || !validateSolanaAddress(recipient)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating Links...
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5" />
              Generate Clickable Wallet Links
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {qrCodeUrl && (
        <div className="mt-8 space-y-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎉 Clickable Payment Links Generated!</h3>
            <p className="text-sm text-gray-600">Amount: <strong>{amount} SOL</strong></p>
            <p className="text-xs text-gray-500 mt-1">
              {isMobile ? 'Tap any button to open directly in that wallet app' : 'Click any button to open payment (mobile users will get direct wallet opening)'}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="text-center">
            <button
              onClick={() => setShowQR(!showQR)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors text-sm font-medium"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? 'Hide QR Code' : 'Show QR Code (Alternative)'}
            </button>
            
            {showQR && (
              <div className="mt-6 inline-block p-4 bg-white rounded-lg shadow-sm">
                <QRCodeDisplay value={qrCodeUrl} size={200} />
                <p className="text-xs text-gray-500 mt-6">
                  Scan with any Solana wallet app
                </p>
              </div>
            )}
          </div>

          {/* Universal Wallet Button */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              {isMobile ? '📱 Click to Open Wallet App:' : '💻 Clickable Payment Link:'}
            </h4>
            <div className="space-y-4">
              
              {/* Universal Solana Pay Button */}
              <ClickableDeepLinkButton
                deepLink={qrCodeUrl}
                walletName="Any Wallet"
                color="bg-gradient-to-r from-gray-600 to-gray-700"
                isMobile={isMobile}
                onCopy={copyToClipboard}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                ⭐ Universal link - works with all Solana wallets
              </p>

              {/* Universal Link Display */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Universal Wallet Link:</h5>
                <div className="bg-white p-3 rounded border font-mono text-xs break-all text-gray-600">
                  {qrCodeUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(qrCodeUrl, 'universal')}
                  className="mt-2 w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {copied.universal ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied.universal ? 'Copied!' : 'Copy Universal Link'}
                </button>
              </div>

            </div>
          </div>

          {/* Updated Usage Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">✨ How to use this universal wallet link:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              {isMobile ? (
                <>
                  <li>• <strong>Universal Button:</strong> Tap "Any Wallet" to open your default Solana wallet app</li>
                  <li>• <strong>Works with All Wallets:</strong> Compatible with Phantom, Backpack, Solflare, Glow, and more</li>
                  <li>• <strong>Share Link:</strong> Copy the universal link to share via WhatsApp, Telegram, email, etc.</li>
                  <li>• <strong>QR Alternative:</strong> Use QR code if the button doesn't work</li>
                </>
              ) : (
                <>
                  <li>• <strong>Mobile Compatibility:</strong> When shared, this button opens wallet apps directly on mobile</li>
                  <li>• <strong>Desktop Support:</strong> Shows QR code or redirects appropriately on desktop</li>
                  <li>• <strong>Universal Link:</strong> Works with all Solana wallets - no need for wallet-specific links</li>
                  <li>• <strong>Easy Sharing:</strong> Copy the link for social media, email, messaging apps</li>
                </>
              )}
            </ul>
          </div>

          {/* Copy Status Indicators */}
          {Object.keys(copied).some(key => copied[key]) && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                <Check className="w-3 h-3" />
                Link copied to clipboard!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}