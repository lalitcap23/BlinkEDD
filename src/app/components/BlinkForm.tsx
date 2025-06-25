'use client';

import { useState } from 'react';
import {
  generateSolanaPayURL,
  generatePhantomDeepLink,
  generateBackpackDeepLink,
  generateSolflareDeepLink,
  generateGlowDeepLink,
  generateUniversalDeepLink,
  validateSolanaAddress
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

export default function BlinkForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number>(0.001);
  const [label, setLabel] = useState('Support Me');
  const [message, setMessage] = useState('');
  
  // Generated URLs
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // For QR code (direct wallet)
  const [universalLink, setUniversalLink] = useState(''); // Universal deep link
  const [phantomLink, setPhantomLink] = useState(''); // Phantom deep link
  const [backpackLink, setBackpackLink] = useState(''); // Backpack deep link
  const [solflareLink, setSolflareLink] = useState(''); // Solflare deep link
  const [glowLink, setGlowLink] = useState(''); // Glow deep link
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

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
      // Generate QR code URL (direct wallet opening)
      const qrUrl = generateSolanaPayURL(recipient.trim(), amount, label.trim(), message.trim());
      
      // Generate deep links for each wallet
      const universalUrl = generateUniversalDeepLink(recipient.trim(), amount, label.trim(), message.trim());
      const phantomUrl = generatePhantomDeepLink(recipient.trim(), amount, label.trim(), message.trim());
      const backpackUrl = generateBackpackDeepLink(recipient.trim(), amount, label.trim(), message.trim());
      const solflareUrl = generateSolflareDeepLink(recipient.trim(), amount, label.trim(), message.trim());
      const glowUrl = generateGlowDeepLink(recipient.trim(), amount, label.trim(), message.trim());
      
      // Set the URLs
      setQrCodeUrl(qrUrl);
      setUniversalLink(universalUrl);
      setPhantomLink(phantomUrl);
      setBackpackLink(backpackUrl);
      setSolflareLink(solflareUrl);
      setGlowLink(glowUrl);
      
      console.log('Generated Deep Links:', {
        qrUrl,
        universalUrl,
        phantomUrl,
        backpackUrl,
        solflareUrl,
        glowUrl,
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

  const testLink = (url: string, walletName: string) => {
    console.log(`Opening ${walletName} deep link:`, url);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ⚡ Solana Payment Link Generator
        </h1>
        <p className="text-gray-600">Create direct wallet links that open instantly in any Solana wallet</p>
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
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-mono"
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
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
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
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
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
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
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
              Generate Wallet Links
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {universalLink && (
        <div className="mt-8 space-y-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎉 Payment Links Generated!</h3>
            <p className="text-sm text-gray-600">Amount: <strong>{amount} SOL</strong></p>
            <p className="text-xs text-gray-500 mt-1">Click any link to open directly in that wallet</p>
          </div>

          {/* Universal Deep Link (Primary) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Universal Link (Auto-detects wallet):
              </label>
              <button
                onClick={() => testLink(universalLink, 'Universal')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Open
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
              <input
                type="text"
                value={universalLink}
                readOnly
                className="flex-1 text-xs text-gray-600 bg-transparent outline-none font-mono"
              />
              <button
                onClick={() => copyToClipboard(universalLink, 'universal')}
                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                  copied.universal 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied.universal ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied.universal ? 'Copied!' : 'Copy'}
              </button>
            </div>
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
              <div className="mt-6 inline-block p-4 bg-white rounded-lg shadow-sm">
                <QRCodeDisplay value={qrCodeUrl} size={200} />
                <p className="text-xs text-gray-500 mt-6">
                  Scan with any Solana wallet app
                </p>
              </div>
            )}
          </div>

          {/* Wallet-Specific Deep Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Wallet-Specific Links:</h4>
            <div className="space-y-3">
              
              {/* Phantom Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Phantom:
                  </label>
                  <button
                    onClick={() => testLink(phantomLink, 'Phantom')}
                    className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded transition-colors"
                  >
                    Open
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs">
                  <input
                    type="text"
                    value={phantomLink}
                    readOnly
                    className="flex-1 text-gray-500 bg-transparent outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(phantomLink, 'phantom')}
                    className={`px-2 py-1 rounded transition-colors ${
                      copied.phantom ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {copied.phantom ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Backpack Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Backpack:
                  </label>
                  <button
                    onClick={() => testLink(backpackLink, 'Backpack')}
                    className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded transition-colors"
                  >
                    Open
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs">
                  <input
                    type="text"
                    value={backpackLink}
                    readOnly
                    className="flex-1 text-gray-500 bg-transparent outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(backpackLink, 'backpack')}
                    className={`px-2 py-1 rounded transition-colors ${
                      copied.backpack ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {copied.backpack ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Solflare Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Solflare:
                  </label>
                  <button
                    onClick={() => testLink(solflareLink, 'Solflare')}
                    className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded transition-colors"
                  >
                    Open
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs">
                  <input
                    type="text"
                    value={solflareLink}
                    readOnly
                    className="flex-1 text-gray-500 bg-transparent outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(solflareLink, 'solflare')}
                    className={`px-2 py-1 rounded transition-colors ${
                      copied.solflare ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {copied.solflare ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Glow Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Glow:
                  </label>
                  <button
                    onClick={() => testLink(glowLink, 'Glow')}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                  >
                    Open
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs">
                  <input
                    type="text"
                    value={glowLink}
                    readOnly
                    className="flex-1 text-gray-500 bg-transparent outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(glowLink, 'glow')}
                    className={`px-2 py-1 rounded transition-colors ${
                      copied.glow ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {copied.glow ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">How to use:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Universal Link:</strong> Works with any Solana wallet, auto-detects installed wallets</li>
              <li>• <strong>Wallet-Specific Links:</strong> Opens directly in the specified wallet</li>
              <li>• <strong>QR Code:</strong> Scan with any Solana wallet mobile app</li>
              <li>• <strong>Share:</strong> Copy any link to share via social media, email, or messaging</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}