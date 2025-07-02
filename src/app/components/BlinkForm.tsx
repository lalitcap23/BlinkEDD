'use client';

import { useState } from 'react';
import {
  generateSolanaPayURL,
  generatePhantomMobileDeepLink,
  generateBackpackMobileDeepLink,
  generateSolflareMobileDeepLink,
  generateGlowMobileDeepLink,
  generateUniversalPaymentLink,
  handleUniversalPayment,
  validateSolanaAddress,
  detectMobilePlatform,
  detectAvailableWallets,
  formatSolAmount
} from '../utils/generateBlink';
import { Copy, ExternalLink, QrCode, Check, AlertCircle, Wallet, Smartphone, Globe } from 'lucide-react';

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

// Enhanced Clickable Deep Link Button Component with Universal Payment Handler
const ClickableDeepLinkButton = ({ 
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
        // Use the universal payment handler
        const result = await handleUniversalPayment(recipient, amount, label, message);
        
        if (result.success) {
          onStatusUpdate(`✅ ${walletName} opened successfully!`);
        } else {
          onStatusUpdate(`❌ ${result.error || 'Failed to open wallet'}`);
        }
      } else {
        // Use specific wallet handler
        const result = await handleUniversalPayment(recipient, amount, label, message, walletName.toLowerCase());
        
        if (result.success) {
          onStatusUpdate(`✅ ${walletName} opened successfully!`);
        } else {
          onStatusUpdate(`❌ ${walletName} not found. Try installing it first.`);
          if (result.fallbackUrl && confirm(`Install ${walletName}?`)) {
            window.open(result.fallbackUrl, '_blank');
          }
        }
      }
    } catch (error) {
      console.error(`Error opening ${walletName}:`, error);
      onStatusUpdate(`❌ Error opening ${walletName}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => onStatusUpdate(''), 3000);
    }
  };

  // Generate deep link for display purposes
  const getDeepLink = () => {
    switch (walletName.toLowerCase()) {
      case 'phantom':
        return generatePhantomMobileDeepLink(recipient, amount, label, message);
      case 'backpack':
        return generateBackpackMobileDeepLink(recipient, amount, label, message);
      case 'solflare':
        return generateSolflareMobileDeepLink(recipient, amount, label, message);
      case 'glow':
        return generateGlowMobileDeepLink(recipient, amount, label, message);
      default:
        return generateSolanaPayURL(recipient, amount, label, message);
    }
  };

  const deepLink = getDeepLink();

  return (
    <div className="space-y-2">
      {/* Clickable Button */}
      <button
        onClick={handleClick}
        disabled={isProcessing}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          block w-full p-4 rounded-xl text-white font-semibold text-center
          transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isHovered ? 'shadow-lg' : 'shadow-sm'}
        `}
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
    case 'any wallet': 
    case 'universal': return '🔗';
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
    case 'universal':
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
  
  // Generated URLs and state
  const [universalPaymentLink, setUniversalPaymentLink] = useState('');
  const [solanaPayURL, setSolanaPayURL] = useState('');
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setStatus('');
    
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
      // Check platform
      const platform = detectMobilePlatform();
      setIsMobile(platform.isMobile);

      // Generate universal payment link (shareable web URL)
      const universalLink = generateUniversalPaymentLink(
        recipient.trim(), 
        amount, 
        label.trim(), 
        message.trim()
      );
      setUniversalPaymentLink(universalLink);

      // Generate Solana Pay URL (for QR codes and direct wallet opening)
      const solanaPayUrl = generateSolanaPayURL(
        recipient.trim(), 
        amount, 
        label.trim(), 
        message.trim()
      );
      setSolanaPayURL(solanaPayUrl);

      // Detect available wallets
      const wallets = await detectAvailableWallets();
      setAvailableWallets(wallets);
      
      console.log('Generated Links:', {
        universalLink,
        solanaPayUrl,
        platform,
        availableWallets: wallets,
        amount: amount,
        recipient: recipient.trim()
      });
      
    } catch (err) {
      console.error('Error generating payment links:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate payment links');
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

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ⚡ Universal Solana Payment Links
        </h1>
        <p className="text-gray-600">Create shareable payment links that work seamlessly across all devices and wallets</p>
        <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
          <span>✅ Universal Links</span>
          <span>✅ Auto-Detection</span>
          <span>✅ All Wallets</span>
          <span>✅ Cross-Platform</span>
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
            <span>{formatSolAmount(amount)}</span>
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

        {/* Status Display */}
        {status && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
            <Wallet className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{status}</span>
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
              Generating Universal Links...
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" />
              Generate Universal Payment Links
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {universalPaymentLink && (
        <div className="mt-8 space-y-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎉 Universal Payment Links Generated!</h3>
            <p className="text-sm text-gray-600">Amount: <strong>{formatSolAmount(amount)}</strong></p>
            <p className="text-xs text-gray-500 mt-1">
              {isMobile ? 'Tap buttons to open wallet apps directly' : 'Share links or use QR codes for mobile payments'}
            </p>
          </div>

          {/* Universal Payment Handler */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              🚀 Smart Payment Buttons (Auto-Detection):
            </h4>
            <div className="space-y-4">
              
              {/* Universal Handler Button */}
              <ClickableDeepLinkButton
                recipient={recipient.trim()}
                amount={amount}
                label={label.trim()}
                message={message.trim()}
                walletName="Universal"
                isMobile={isMobile}
                onCopy={copyToClipboard}
                onStatusUpdate={updateStatus}
              />

              {/* Available Wallet Buttons */}
              {isMobile && availableWallets.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {availableWallets.slice(0, 4).map((wallet) => (
                    <div key={wallet} className="col-span-1">
                      <ClickableDeepLinkButton
                        recipient={recipient.trim()}
                        amount={amount}
                        label={label.trim()}
                        message={message.trim()}
                        walletName={wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                        isMobile={isMobile}
                        onCopy={copyToClipboard}
                        onStatusUpdate={updateStatus}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shareable Links Section */}
          <div className="space-y-4">
            {/* Universal Payment Link */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Universal Payment Page:
              </h5>
              <div className="bg-gray-50 p-3 rounded border font-mono text-xs break-all text-gray-600 mb-2">
                {universalPaymentLink}
              </div>
              <button
                onClick={() => copyToClipboard(universalPaymentLink, 'universal')}
                className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                {copied.universal ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied.universal ? 'Copied!' : 'Copy Universal Link'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Share this link anywhere - it creates a payment page that works on all devices
              </p>
            </div>

            {/* Advanced Options */}
            <div className="text-center">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
            </div>

            {showAdvanced && (
              <>
                {/* Direct Solana Pay URL */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Direct Solana Pay URL:</h5>
                  <div className="bg-gray-50 p-3 rounded border font-mono text-xs break-all text-gray-600 mb-2">
                    {solanaPayURL}
                  </div>
                  <button
                    onClick={() => copyToClipboard(solanaPayURL, 'solpay')}
                    className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {copied.solpay ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied.solpay ? 'Copied!' : 'Copy Solana Pay URL'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Direct wallet protocol URL - for QR codes and wallet integrations
                  </p>
                </div>

                {/* QR Code Section */}
                <div className="text-center">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    <QrCode className="w-4 h-4" />
                    {showQR ? 'Hide QR Code' : 'Show QR Code'}
                  </button>
                  
                  {showQR && (
                    <div className="mt-6 inline-block p-6 bg-white rounded-lg shadow-sm border">
                      <QRCodeDisplay value={solanaPayURL} size={200} />
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500">
                          Scan with any Solana wallet app
                        </p>
                        <button
                          onClick={() => copyToClipboard(solanaPayURL, 'qr')}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                        >
                          {copied.qr ? 'Copied!' : 'Copy QR URL'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Usage Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">✨ How to use these payment links:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Universal Page:</strong> Share the first link to create a payment page that works everywhere</li>
              <li>• <strong>Smart Detection:</strong> Automatically detects and opens the best available wallet</li>
              <li>• <strong>Cross-Platform:</strong> Works on mobile apps, desktop extensions, and web wallets</li>
              <li>• <strong>One Link for All:</strong> No need to create separate links for different wallets</li>
              <li>• <strong>QR Alternative:</strong> Use QR codes for in-person payments or when links don't work</li>
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